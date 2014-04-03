module.exports = function (req, res, next) {
    var specailInput = req.body.specailInput;
    if (specailInput !== undefined) {
        if (specailInput.length > 0)
            res.forbidden();
    }
    next();
};