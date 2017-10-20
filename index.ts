/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types max-line-length */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction,
    ValidationOptions
} from "@neworbit/validation";

import { Subject } from "rxjs";

const createKnockoutWrapper = (validationSystem?: ValidateFunction) => {
    const validate = validationSystem || newOrbitValidate;

    const getErrors = async <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>
    ) => {
        const value = valueObservable();
        return await validate(validators, value);
    };

    const bindValidation = <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>,
        errorObservable: KnockoutObservable<string[]>,
        dependentObservables?: KnockoutObservable<any>[]
    ) => {

        const subject = new Subject();

        subject.debounceTime(150)
               .switchMap(() => getErrors(validators, valueObservable))
               .subscribe((errors) => {
                   errorObservable(errors);
               });

        valueObservable.subscribe(() => subject.next());
    
        subject.next();
    };

    return {
        bindValidation
    };
};

export {
    ValidateFunction,
    createKnockoutWrapper
};
