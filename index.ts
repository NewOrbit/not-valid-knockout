/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types */

import { validate as newOrbitValidate, ValidationFunction, ValidationOptions } from "@neworbit/validation";

interface Observable<T> extends SettableObservable<T> {
    (): T;
    subscribe: (callback: (value: T) => any) => any;
}

interface SettableObservable<T> {
    (value: T | null): void;
}

interface BindValidationOptions {
    validationOptions?: ValidationOptions;
    validationSystem?: ValidationSystem;
}

type ValidationSystem = <T>(validators: Array<ValidationFunction<T>>, value: T, options?: ValidationOptions) => Array<string>;

const getValidationSystem = (options?: BindValidationOptions) => {
    if (options && options.validationSystem) {
        return options.validationSystem;
    }

    return newOrbitValidate;
};

const bindValidation = <T>(
    validators: Array<ValidationFunction<T>>,
    valueObservable: Observable<T>,
    errorObservable: SettableObservable<Array<string>>,
    options?: BindValidationOptions
) => {
    const validate = getValidationSystem(options);
    const validationOptions = options ? options.validationOptions : undefined;

    const doValidation = (value: T) => {
        const errors = validate(validators, value, validationOptions);
        errorObservable(errors);
    };

    valueObservable.subscribe(v => {
        doValidation(v);
    });
};

export {
    SettableObservable,
    Observable,
    ValidationSystem,
    BindValidationOptions,
    bindValidation
};
