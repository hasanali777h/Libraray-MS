'use strict';
const validator = (schema, property) => (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        errors: { label: 'key' },
    });
    if (error) {
        const errMsg = error.details[0].message;
        return res.status(400).json({ success: false, msg: errMsg });
    }
    req[property] = value;
    return next();
};
module.exports = validator;
