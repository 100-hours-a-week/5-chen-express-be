const {validationResult} = require("express-validator");

//https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    for (const err of errors.array()) {
        extractedErrors.push({[err.path]: err.msg})
    }

    return res.status(422).json({
        errors: extractedErrors,
    })
}
exports.validate = validate