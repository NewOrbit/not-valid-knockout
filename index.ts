/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types max-line-length */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction,
    ValidationOptions
} from "@neworbit/validation";

interface BindValidationOptions {
    validationOptions?: ValidationOptions;
    validationSystem?: ValidateFunction;
}

const bindValidation = <T>(
    validators: Array<ValidationFunction<T>>,
    valueObservable: KnockoutObservable<T>,
    errorObservable: KnockoutObservable<Array<string>>,
    options?: ValidationOptions,
    validationSystem?: ValidateFunction
) => {
    const validate = validationSystem || newOrbitValidate;
    const validationOptions = options || undefined;

    const doValidation = async (value: T) => {
        try {
            const errors = await validate(validators, value, validationOptions);
            errorObservable(errors);
        } catch (ex) {
            // we need to permit console.log here as it's part of functionality
            // tslint:disable-next-line:no-console
            console.log(ex);
        }
    };

    valueObservable.subscribe(v => {
        doValidation(v);
    });

    // validate initial value
    const currentValue = valueObservable();
    doValidation(currentValue);
};

export {
    ValidateFunction,
    BindValidationOptions,
    bindValidation
};
