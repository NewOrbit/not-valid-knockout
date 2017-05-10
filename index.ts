/// <reference types="knockout" />
import { ValidationFunction } from "@neworbit/validation";

const validate = <T>(
    validators: Array<ValidationFunction<T>>, 
    valueObservable: KnockoutObservable<T>, 
    errorObservable: KnockoutObservableArray<string>
) => {
    
};

export {
    validate
};
