module.exports = function(req, res, next) {

    var ticket = req.body;

    tokenService.parse(req)
        .then(function(user) {
            if (user.bonus_info && ticket.extra_bonus) {
                return res.json(401, { error: 'You only get the bonus 1 times' });
            } else {
                next();
            }
        })
};