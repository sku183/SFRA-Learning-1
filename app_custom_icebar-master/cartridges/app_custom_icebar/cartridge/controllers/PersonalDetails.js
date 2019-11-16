'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var URLUtils = require('dw/web/URLUtils');

server.get('Start', csrfProtection.generateToken, function (req, res, next) {
	var pdActionUrl = URLUtils.url('PersonalDetails-Submit');
	var pdForm = server.forms.getForm('personaldetails');
	pdForm.clear();
	
	res.render('/personaldetails', {
        actionUrl: pdActionUrl,
        pdForm: pdForm
    });
	
	
	next();
});


server.post('Submit', csrfProtection.validateAjaxRequest, function (req, res, next) {
	res.json({
        success: true,
        redirectUrl: URLUtils.url('PersonalDetails-Start').toString()
	});
	
	
	next();
});

module.exports = server.exports();





