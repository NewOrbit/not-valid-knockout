/* tslint:disable:max-line-length array-type */

import { TestFixture, TestCase, Expect, SpyOn, Setup, Teardown, Any, AsyncTest, Timeout, Test } from "alsatian";
import { mockObservable } from "@neworbit/knockout-test-utils";
import { createKnockoutWrapper, ValidateFunction } from "./index";
import { ValidationFunction } from "not-valid";

const validationSystem: { validate: ValidateFunction } = {
    validate: async <T> (validators: any[], value: T) => await []
};

const getMockObservable = <T>(value?: T) => mockObservable<T>(value).observable as KnockoutObservable<T>;

function wait(waitPeriodMilliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, waitPeriodMilliseconds));
}

const DEBOUNCE_WAIT_PERIOD = 351;

@TestFixture()
export class ValidationTests {

    private validateSpy: any;

    @Setup
    public setup() {
        this.validateSpy = SpyOn(validationSystem, "validate");
    }

    @Teardown
    public teardown() {
        this.validateSpy.restore();
    }

    @Test()
    @TestCase([ ])
    @TestCase([ () => "bad" ])
    public async shouldPassValidatorsToValidationSystem(validators: any[]) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<string[]>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation(validators, value, errors);

        // trigger the validation
        value("trigger it");

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalledWith(validators, Any);
    }

    @Test()
    @TestCase("some value")
    @TestCase("thierry henry is the best football player of all time")
    public async shouldPassValueToValidationSystem(input: string) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<string[]>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // trigger the validation
        value(input);

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), input);
    }

    @Test()
    @TestCase([ "green error", "blue error" ])
    @TestCase([ "biscuits and cake a happy man doth make" ])
    public async shouldPassValidationErrorsToErrorObservable(providedErrors: string[]) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<string[]>();

        this.validateSpy.andReturn(Promise.resolve(providedErrors));

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // trigger the validation
        value("bad!");

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(errors()).toEqual(providedErrors);
    }

    @Test()
    @TestCase(20)
    @TestCase(30)
    public async shouldValidateInitialValueOnBind(input: number) {
        const value = getMockObservable<number>(input);
        const errors = getMockObservable<string[]>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), input);
    }

    @Timeout(1000)
    @AsyncTest()
    public async shouldDebounceValidationsIfTooSoon() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<string[]>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // set value immediately and update a short time after
        value(20);

        await wait(200); // wait 200ms which is less than the debounce time

        value(30);

        await wait(DEBOUNCE_WAIT_PERIOD);

        // first should not be hit due to debouncing
        Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), 20);
        Expect(validationSystem.validate).toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), 30);
    }

    @Timeout(1000)
    @Test()
    public async shouldNotDebounceValidationsAfterTwoHundredMilliseconds() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<string[]>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // set value immediately and update after 151ms
        value(20);

        await wait(DEBOUNCE_WAIT_PERIOD); // wait until the debounce timeout

        value(30);

        await wait(DEBOUNCE_WAIT_PERIOD);

        // both should be hit (spaced apart so no debounce)
        Expect(validationSystem.validate).toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), 20);
        Expect(validationSystem.validate).toHaveBeenCalledWith(Any<Array<ValidationFunction<any>>>(Array), 30);
    }

    @Timeout(1000)
    @Test()
    public async shouldRevalidateForFirstDependentObservable() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<string[]>();

        const dependent = getMockObservable<number>(500);

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors, [ dependent ]);

        await wait(DEBOUNCE_WAIT_PERIOD);

        dependent(600);

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalled().exactly(2);
    }

    @Timeout(1000)
    @Test()
    public async shouldRevalidateForSecondDependentObservable() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<string[]>();

        const firstDependent = getMockObservable<number>(500);
        const secondDependent = getMockObservable<number>(800);

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors, [ firstDependent, secondDependent ]);

        await wait(DEBOUNCE_WAIT_PERIOD);

        secondDependent(600);

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalled().exactly(2);
    }

    @Test()
    public async shouldDebounceForDependentObservables() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<string[]>();

        const dependent = getMockObservable<number>(500);

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors, [ dependent ]);

        dependent(600);

        await wait(DEBOUNCE_WAIT_PERIOD);

        Expect(validationSystem.validate).toHaveBeenCalled().exactly(1);
    }

}
