import { TestFixture, Test, TestCase, Expect, SpyOn, Setup, Teardown, FunctionSpy, Any } from "alsatian";
import { mockObservable } from "@neworbit/knockout-test-utils";
import { bindValidation, ValidationSystem } from "./index";

const validationSystem: { validate: ValidationSystem } = {
    validate: <T>(validators: Array<any>, value: T) => []
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
    public shouldPassValidationErrorsToErrorObservable(providedErrors: Array<string>) {
        const value = getMockObservable<string>();
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, undefined, validationSystem.validate);

        this.validateSpy.andReturn(providedErrors);

        // trigger the validation
        value("bad!");

        Expect(errors()).toEqual(providedErrors);
    }

    @TestCase(20)
    @TestCase(30)
    public shouldNotValidateInitialValueOnBind(input: number) {
        const value = getMockObservable<number>();
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, undefined, validationSystem.validate);

        Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any, input, Any);
    }

    @TestCase({ sequential: true })
    @TestCase({ sequential: false })
    public shouldPassOptionsToValidator(options: any) {
        const value = getMockObservable<number>();
        const errors = getMockObservable<Array<string>>();

        bindValidation([ ], value, errors, options, validationSystem.validate);

        Expect(validationSystem.validate).not.toHaveBeenCalledWith(Any, Any, options);
    }

    @TestCase(5)
    @TestCase(500)
    public shouldValidateWithCurrentValueWhenRevalidateCalled(input: number) {
        const value = getMockObservable<number>(input);
        const errors = getMockObservable<Array<string>>();

        const validationBinding = bindValidation([ ], value, errors, undefined, validationSystem.validate);

        validationBinding.revalidate();

        Expect(validationSystem.validate).toHaveBeenCalledWith(Any, input, Any);
    }

}
