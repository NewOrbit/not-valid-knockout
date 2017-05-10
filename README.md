# @neworbit/validation-knockout

Interface between knockout and [@neworbit/validation](https://github.com/NewOrbit/validation/).

## Usage

```typescript
import { createValidator } from 
import { validate } from "@neworbit/validation-knockout";

const mustBeJames = createValidator<string>(v => v === "James", "Value must be 'James'");

const name = ko.observable<string>();
const nameErrors = ko.observableArray<string>();

// subscribe to an observable, validate, put errors into an observableArray
validate<string>(
    [ mustBeJames ],
    name,
    nameErrors
);
```

## Validation system

By default, `@neworbit/validation-knockout` uses `@neworbit/validation` to validate. If you want to use another system, you can use the `validationSystem` parameter in `validate`.

```typescript
validate<string>([ ], value, errors, yourValidationSystemHere);
```

Your validation system must be a function with the following signature:

```typescript
type ValidationResult = string | null;
type ValidationFunction<T> = (value: T) => ValidationResult;
type ValidationSystem = <T>(validators: Array<ValidationFunction<T>>, value: T) => Array<ValidationResult>;
```