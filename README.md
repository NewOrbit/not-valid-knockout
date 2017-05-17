# @neworbit/validation-knockout

Interface between knockout and [@neworbit/validation](https://github.com/NewOrbit/validation/).

## Usage

```typescript
import { createValidator } from 
import { bindValidation } from "@neworbit/validation-knockout";

const mustBeJames = createValidator<string>(v => v === "James", "Value must be 'James'");

const name = ko.observable<string>();
const nameErrors = ko.observableArray<string>();

// subscribe to an observable, validate, put errors into an observableArray
bindValidation<string>(
    [ mustBeJames ],
    name,
    nameErrors
);
```

### Revalidation

`bindValidation` returns an object with a `revalidate` method, which you can use to revalidate at will.

## Validation system

By default, `@neworbit/validation-knockout` uses `@neworbit/validation` to validate. If you want to use another system, you can use the `validationSystem` property in the `options` parameter in `bindValidation`.

```typescript
bindValidation<string>([ ], value, errors, { validationSystem: yourValidationSystemHere });
```

Your validation system must be a function with the following signature:

```typescript
interface ValidationOptions {
    sequential?: boolean;
}
type ValidationResult = string | null;
type ValidationFunction<T> = (value: T) => ValidationResult;
type ValidationSystem = <T>(validators: Array<ValidationFunction<T>>, value: T, options?: ValidationOptions) => Array<string>;
```

## Options

You can pass a `ValidationOptions` to your validator by using the `validationOptions` property in the `options` parameter:

```typescript
const options: ValidationOptions = { sequential: true };

bindValidation<string>([ ], value, errors, { validationOptions: options });
```