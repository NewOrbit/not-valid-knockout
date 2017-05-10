/// <reference types="knockout" />
import { ValidationFunction } from "@neworbit/validation";

interface Observable<T> extends SettableObservable<T> {
    (): T;
    subscribe(callback: (newValue: T[]) => void): void;
}

interface SettableObservable<T> {
    (value: T | null): void;
}

const validate = <T>(
    validators: Array<ValidationFunction<T>>, 
    valueObservable: Observable<T>, 
    errorObservable: SettableObservable<string>
) => {

};

export {
    SettableObservable,
    Observable,
    validate    
};
