# not-valid-knockout

Interface between knockout and [not-valid](https://github.com/NewOrbit/not-valid/).

## Usage

```typescript
import { createValidator } from "not-valid";
import { createKnockoutWrapper } from "not-valid-knockout";

const mustBeJames = createValidator<string>(v => v === "James", "Value must be 'James'");

const name = ko.observable<string>();
const nameErrors = ko.observableArray<string>();

const bindValidation = createKnockoutWrapper().bindValidation;

// subscribe to an observable, validate, put errors into an observableArray
bindValidation<string>(
    [ mustBeJames ],
    name,
    nameErrors
);
```
