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

## Testing

If you need to reduce the debounce time for testing you can set the environment variable `NOT_VALID_KNOCKOUT_DEBOUNCE`.

## License

Made with :sparkling_heart: by [NewOrbit](https://www.neworbit.co.uk/) in Oxfordshire, and licensed under the [MIT License](LICENSE)
