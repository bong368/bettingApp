/**
 * GSoftController
 *
 * @description :: Server-side logic for managing Gsofts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Curl = require('node-libcurl').Curl;
module.exports = {
    getAllGame: function(req, res) {
        var curl = new Curl();
        parser = new xml2js.Parser({ explicitArray: false });

        curl.setOpt('URL', 'http://img.gsoft88.net/gamelist.aspx?provider=pt');

        curl.on('end', function(statusCode, body, headers) {

            var xml = body.replace(/&/g, "&amp;");

            parser.parseString(xml, function(err, result) {
                _.forEach(result.gamelist.game, function(value, key) {
                    result.gamelist.game[key] = {
                    	game_type: value.game_type,
                    	game_group: value.game_group,
                    	game_name: value.game_name,
                    	game_code: value.game_code,
                    }
                });
                return res.json(result.gamelist.game);
            });
            this.close();
        });

        curl.on('error', curl.close.bind(curl));
        curl.perform();
    },

    signin: function (req, res) {
        var user = undefined;
    	tokenService.parse(req)
            .then(function(user) {
            	return Users.findOne({username: user.username});
            })
            .then(function (cred) {
                user = cred;
                return playTechService.getPassword(user.username);
            })
            .then(function (password) {
            	return playTechService.signin(user.username, password, req.body.gameCode);
            })
	        .then(function(result) {
	            return res.json(200, {data : result});
	        })
	        .catch(function (error) {
	        	return res.json(200, {data : 'http://cache.download.banner.redcoral88.com/flash/54/launchcasino.html?language=en&mode=offline&game=7bal#7bal'});
	        })
    },

    updatePassword: function (req, res) {
        var user = undefined;
        tokenService.parse(req)
            .then(function(cred) {
                user = cred;
                return CredentialPlaytech.findOne({username: user.username});
            })
            .then(function (playtech) {
                if (playtech) {
                    return CredentialPlaytech.update({username: user.username}, {password: req.body.password});
                } else {
                    return CredentialPlaytech.create({username: user.username, password: req.body.password})
                }
            })
            .then(function (argument) {
                var cred = {
                    username: user.username,
                    password: req.body.password
                }
                return playTechService.updatePassword(cred)
            })
            .then(function (result) {
                if (result) {
                    return res.json({result: result});
                }
            })
            
    }
};
