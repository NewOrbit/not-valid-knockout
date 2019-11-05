/// <reference types="knockout" />

/* tslint:disable:interface-name callable-types max-line-length array-type */

import {
    validate as newOrbitValidate,
    ValidationFunction,
    ValidateFunction
} from "not-valid";

import { BehaviorSubject, Observable } from "rxjs";

const DEBOUNCE_WAIT_PERIOD = process.env.NOT_VALID_KNOCKOUT_DEBOUNCE !== undefined
    ? +process.env.NOT_VALID_KNOCKOUT_DEBOUNCE
    : 350;

const createKnockoutWrapper = (validationSystem?: ValidateFunction) => {
    const validate = validationSystem || newOrbitValidate;

    const bindValidation = <T>(
        validators: ValidationFunction<T>[],
        valueObservable: KnockoutObservable<T>,
        errorObservable: KnockoutObservable<string[]>,
        dependentObservables?: KnockoutObservable<any>[]
    ): Observable<string[]> => {

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

        const resultObservable = subject
            .debounceTime(DEBOUNCE_WAIT_PERIOD)
            .switchMap(async value => await validate(validators, value));

        resultObservable.subscribe(errors => errorObservable(errors));

        subscribeValidationToKnockoutObservable(valueObservable);

        if (dependentObservables) {
            dependentObservables.forEach(o => subscribeValidationToKnockoutObservable(o));
        }

        return resultObservable;
    };

    return {
        bindValidation
    };
};

export {
    ValidateFunction,
    createKnockoutWrapper
};
