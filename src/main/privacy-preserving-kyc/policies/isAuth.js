module.exports = function (req, res, next) {
    if (req.session.username) {
        return next();
    }
    return res.redirect(401, '/issuer');
}