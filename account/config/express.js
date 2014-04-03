module.exports.express = {
    customMiddleware: function (app) {
        console.log("errorHanding of Middleware is called");
        app.use(function (err, req, res, next) {
            console.log("installed errorHanding is used");
            next();
        })
    }
}