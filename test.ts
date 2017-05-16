import { TestFixture, Test, TestCase, Expect, SpyOn, Setup, Teardown, FunctionSpy, Any } from "alsatian";
import { mockObservable } from "@neworbit/knockout-test-utils";
import { bindValidation, ValidationSystem } from "./index";

const validationSystem: { validate: ValidationSystem } = {
    validate: <T>(validators: Array<any>, value: T) => []
};

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
        const value = mockObservable<string>().observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation(validators, value, errors, {
            validationSystem: validationSystem.validate
        });

        // trigger the validation
        value("trigger it");

        Expect(validationSystem.validate).toHaveBeenCalledWith(validators, Any, Any);
    }

    @TestCase("some value")
    @TestCase("thierry henry is the best football player of all time")
    public shouldPassValueToValidationSystem(input: string) {
        const value = mockObservable<string>().observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, {
            validationSystem: validationSystem.validate
        });

        // trigger the validation
        value(input);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input, Any);
    }

    @TestCase([ "green error", "blue error" ])
    @TestCase([ "biscuits and cake a happy man doth make" ])
    public shouldPassValidationErrorsToErrorObservable(providedErrors: Array<string>) {
        const value = mockObservable<string>().observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, {
            validationSystem: validationSystem.validate
        });

        this.validateSpy.andReturn(providedErrors);

        // trigger the validation
        value("bad!");

        Expect(errors()).toEqual(providedErrors);
    }

    @TestCase(20)
    @TestCase(30)
    public shouldNotValidateInitialValueOnBind(input: number) {
        const value = mockObservable<number>(input).observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, {
            validationSystem: validationSystem.validate
        });

        Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any, input, Any);
    }

    @TestCase({ sequential: true })
    @TestCase({ sequential: false })
    public shouldPasOptionsToValidator(options: any) {
        const value = mockObservable<number>().observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, {
            validationOptions: options
        });

        Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any, Any, options);
    }

}
