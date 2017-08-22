/* tslint:disable:max-line-length */

import { TestFixture, Test, TestCase, Expect, SpyOn, Setup, Teardown, FunctionSpy, Any, AsyncTest, FocusTest } from "alsatian";
import { mockObservable } from "@neworbit/knockout-test-utils";
import { bindValidation, ValidateFunction } from "./index";

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

        bindValidation(validators, value, errors, undefined, validationSystem.validate);

        // trigger the validation
        value("trigger it");

        Expect(validationSystem.validate).toHaveBeenCalledWith(validators, Any, Any);
    }

    @TestCase("some value")
    @TestCase("thierry henry is the best football player of all time")
    public shouldPassValueToValidationSystem(input: string) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, undefined, validationSystem.validate);

        // trigger the validation
        value(input);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input, Any);
    }

    @TestCase([ "green error", "blue error" ])
    @TestCase([ "biscuits and cake a happy man doth make" ])
    public async shouldPassValidationErrorsToErrorObservable(providedErrors: Array<string>) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        this.validateSpy.andReturn(Promise.resolve(providedErrors));

        bindValidation([ ], value, errors, undefined, validationSystem.validate);

        // trigger the validation
        value("bad!");

        Expect(errors()).toEqual(providedErrors);
    }

    @TestCase(20)
    @TestCase(30)
    public shouldValidateInitialValueOnBind(input: number) {
        const value = getMockObservable<number>(input);
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, undefined, validationSystem.validate);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input, Any);
    }

    @TestCase({ sequential: true })
    @TestCase({ sequential: false })
    public shouldPassOptionsToValidator(options: any) {
        const value = getMockObservable<number>();
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, options, validationSystem.validate);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, Any, options);
    }

}
