/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types max-line-length */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction,
    ValidationOptions
} from "@neworbit/validation";

const createKnockoutWrapper = (validationSystem?: ValidateFunction) => {
    const validate = validationSystem || newOrbitValidate;

    const doValidation = async <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>,
        errorObservable: KnockoutObservable<string[]>
    ) => {
        try {
            const value = valueObservable();
            const errors = await validate(validators, value);
            errorObservable(errors);
        } catch (ex) {
            // we need to permit console.log here as it's part of functionality
            // tslint:disable-next-line:no-console
            console.log(ex);
        }
    };

    const bindValidation = <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>,
        errorObservable: KnockoutObservable<string[]>,
        dependentObservables?: KnockoutObservable<any>[]
    ) => {
        const validate = () => doValidation(validators, valueObservable, errorObservable);
        const subscribeToObservable = (observable: KnockoutObservable<any>) => {
            observable.subscribe(validate);
        };

        subscribeToObservable(valueObservable);
    
        if (dependentObservables) {
            // execute validation on all dependent observables
            dependentObservables.forEach(subscribeToObservable);
        }
    
        validate();
    };

    return {
        bindValidation
    };
};

export {
    ValidateFunction,
    createKnockoutWrapper
};
