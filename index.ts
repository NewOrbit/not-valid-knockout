/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types max-line-length array-type */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction,
    ValidationOptions
} from "not-valid";

import { BehaviorSubject } from "rxjs";

const DEBOUNCE_WAIT_PERIOD = 350;

const createKnockoutWrapper = (validationSystem?: ValidateFunction) => {
    const validate = validationSystem || newOrbitValidate;

    const bindValidation = <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>,
        errorObservable: KnockoutObservable<string[]>,
        dependentObservables?: KnockoutObservable<any>[]
    ) => {

        const triggerValidation = () => {
            const value = valueObservable();
            subject.next(value);
        };

        const subscribeValidationToKnockoutObservable =
            (observable: KnockoutObservable<any>) => {
                observable.subscribe(triggerValidation);
            };

        const initialValue = valueObservable();
        const subject = new BehaviorSubject<T>(initialValue);

        subject
            .debounceTime(DEBOUNCE_WAIT_PERIOD)
            .switchMap(async value => await validate(validators, value))
            .subscribe(errors => errorObservable(errors));

        subscribeValidationToKnockoutObservable(valueObservable);

        if (dependentObservables) {
            dependentObservables.forEach(o => subscribeValidationToKnockoutObservable(o));
        }
    };

    return {
        bindValidation
    };
};

export {
    ValidateFunction,
    createKnockoutWrapper
};
