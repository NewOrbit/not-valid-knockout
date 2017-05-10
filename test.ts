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
        
        bindValidation(validators, value, errors, validationSystem.validate);

        // trigger the validation
        value("trigger it");

        Expect(validationSystem.validate).toHaveBeenCalledWith(validators, Any);
    }

    @TestCase("some value")
    @TestCase("thierry henry is the best football player of all time")
    public shouldPassValueToValidationSystem(input: string) {
        const value = mockObservable<string>().observable;
        const errors = mockObservable<Array<string>>().observable;
        
        bindValidation([ ], value, errors, validationSystem.validate);

        // trigger the validation
        value(input);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input);
    }

    @TestCase([ "green error", "blue error" ])
    @TestCase([ "biscuits and cake a happy man doth make" ])
    public shouldPassValidationErrorsToErrorObservable(providedErrors: Array<string>) {
        const value = mockObservable<string>().observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, validationSystem.validate);

        this.validateSpy.andReturn(providedErrors);

        // trigger the validation
        value("bad!");

        Expect(errors()).toEqual(providedErrors);
    }
    
    @TestCase(20)
    @TestCase(30)
    public shouldValidateInitialValueOnBind(input: number) {
        const value = mockObservable<number>(input).observable;
        const errors = mockObservable<Array<string>>().observable;

        bindValidation([ ], value, errors, validationSystem.validate);

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input);
    }

}