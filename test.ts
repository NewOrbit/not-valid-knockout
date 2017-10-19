/* tslint:disable:max-line-length */

import { TestFixture, Test, TestCase, Expect, SpyOn, Setup, Teardown, FunctionSpy, Any, AsyncTest, FocusTest } from "alsatian";
import { mockObservable } from "@neworbit/knockout-test-utils";
import { createKnockoutWrapper, ValidateFunction } from "./index";

const validationSystem: { validate: ValidateFunction } = {
    validate: async <T> (validators: Array<any>, value: T) => await []
};

const getMockObservable = <T>(value?: T) => mockObservable<T>(value).observable as KnockoutObservable<T>;

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

    @TestCase([ ])
    @TestCase([ () => "bad" ])
    public shouldPassValidatorsToValidationSystem(validators: Array<any>) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation(validators, value, errors);

        // trigger the validation
        value("trigger it");

        Expect(validationSystem.validate).toHaveBeenCalledWith(validators, Any);
    }

    @TestCase("some value")
    @TestCase("thierry henry is the best football player of all time")
    public shouldPassValueToValidationSystem(input: string) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // trigger the validation
        value(input);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input);
    }

    @TestCase([ "green error", "blue error" ])
    @TestCase([ "biscuits and cake a happy man doth make" ])
    public async shouldPassValidationErrorsToErrorObservable(providedErrors: Array<string>) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        this.validateSpy.andReturn(Promise.resolve(providedErrors));

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // trigger the validation
        value("bad!");

        Expect(errors()).toEqual(providedErrors);
    }

    @TestCase(20)
    @TestCase(30)
    public shouldValidateInitialValueOnBind(input: number) {
        const value = getMockObservable<number>(input);
        const errors = getMockObservable<Array<string>>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input);
    }

    @AsyncTest()
    public shouldDebounceValidationsIfTooSoon() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<Array<string>>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // set value immediately and update immediately
        value(20);
        value(30);

        return new Promise((resolve, reject) => {
            // only second should be hit (first debounced)
            setTimeout(() => {
                Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any, 20);
                Expect(validationSystem.validate).toHaveBeenCalledWith(Any, 30);
            }, 500);
        });
    }

    @AsyncTest()
    public shouldNotDebounceValidationsAfterTwoHundredMilliseconds() {
        const value = getMockObservable<number>(10);
        const errors = getMockObservable<Array<string>>();

        const bindValidation = createKnockoutWrapper(validationSystem.validate).bindValidation;
        bindValidation([ ], value, errors);

        // set value immediately and update after 200ms
        value(20);

        setTimeout(() => {
            value(30);
        }, 200);

        return new Promise((resolve, reject) => {
            // both should be hit (spaced apart so no debounce)
            setTimeout(() => {
                Expect(validationSystem.validate).toHaveBeenCalledWith(Any, 20);
                Expect(validationSystem.validate).toHaveBeenCalledWith(Any, 30);
            }, 500);
        });
    }

}
