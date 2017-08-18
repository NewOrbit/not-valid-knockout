/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction,
    ValidationOptions
} from "@neworbit/validation";

interface BindValidationOptions {
    validationOptions?: ValidationOptions;
    validationSystem?: ValidateFunction<any>;
}

const bindValidation = <T>(
    validators: Array<ValidationFunction<T>>,
    valueObservable: KnockoutObservable<T>,
    errorObservable: KnockoutObservable<Array<string>>,
    options?: ValidationOptions,
    validationSystem?: ValidateFunction<T>
) => {
    const validate = validationSystem || newOrbitValidate;
    const validationOptions = options || undefined;

    const doValidation = async (value: T) => {
        try {
            const errors = await validate(validators, value, validationOptions);
            errorObservable(errors);
        } catch (ex) {
            console.log(ex);
        }
    };

    valueObservable.subscribe(v => {
        doValidation(v);
    });

    const revalidate = () => {
        const currentValue = valueObservable();
        doValidation(currentValue);
    };

    revalidate();

    return {
        revalidate
    };
};

export {
    ValidateFunction,
    BindValidationOptions,
    bindValidation
};
