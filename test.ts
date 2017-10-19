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

}
