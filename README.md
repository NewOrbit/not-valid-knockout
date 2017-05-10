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
validate(
    [ mustBeJames ],
    name,
    nameErrors
);