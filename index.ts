/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types */

import { validate as newOrbitValidate, ValidationFunction, ValidationOptions } from "@neworbit/validation";

interface BindValidationOptions {
    validationOptions?: ValidationOptions;
    validationSystem?: ValidationSystem;
}

type ValidationSystem = <T>(
    validators: Array<ValidationFunction<T>>,
    value: T,
    options?: ValidationOptions
) => Array<string>;

const getValidationSystem = (options?: BindValidationOptions) => {
    if (options && options.validationSystem) {
        return options.validationSystem;
    }

    return newOrbitValidate;
};

const bindValidation = <T>(
    validators: Array<ValidationFunction<T>>,
    valueObservable: KnockoutObservable<T>,
    errorObservable: KnockoutObservable<Array<string>>,
    options?: ValidationOptions,
    validationSystem?: ValidationSystem
) => {
    const validate = validationSystem || newOrbitValidate;
    const validationOptions = options || undefined;

    const doValidation = (value: T) => {
        const errors = validate(validators, value, validationOptions);
        errorObservable(errors);
    };

    valueObservable.subscribe(v => {
        doValidation(v);
    });

    const revalidate = () => {
        const currentValue = valueObservable();
        doValidation(currentValue);
    };

    return {
        revalidate
    };
};

export {
    ValidationSystem,
    BindValidationOptions,
    bindValidation
};
