/// <reference types="knockout" />
import * as Validation from "@neworbit/validation";

interface Observable<T> extends SettableObservable<T> {
    (): T;
    subscribe: (callback: (value: T) => any) => any;
}

interface SettableObservable<T> {
    (value: T | null): void;
}

type ValidationSystem = <T>(validators: Array<Validation.ValidationFunction<T>>, value: T) => Array<Validation.ValidationResult>;

const bindValidation = <T>(
    validators: Array<Validation.ValidationFunction<T>>, 
    valueObservable: Observable<T>, 
    errorObservable: SettableObservable<Array<string>>,
    validationSystem?: ValidationSystem
) => {

};

export {
    SettableObservable,
    Observable,
    ValidationSystem,
    bindValidation    
};
