import { z } from 'zod';

// Generic validation middleware.
// Usage: validate(schema)            -> validates req.body
//        validate(schema, 'params')  -> validates req.params
//        validate(schema, 'query')   -> validates req.query
function validate(schema, source = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed.',
                errors: z.flattenError(result.error).fieldErrors
            });
        }

        // Replace the raw input with the cleaned data (unknown fields stripped, transforms applied).
        // defineProperty is needed because in Express 5 req.query is a getter and can't be assigned.
        Object.defineProperty(req, source, { value: result.data, writable: true, configurable: true, enumerable: true });

        next();
    };
}

export default validate;
