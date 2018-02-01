var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const port = 3000;


app.get('/*', function(req,res){
	var regex = ""
	//var n = req.url.search([0-9]);
	//var phoneNumber = phoneUtil.parse('202 456 1414', 'US');
	var str = req.url.replace(/%20/g, " ");
	var str = str.replace(/[{()}]/g, " ");
	str = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.exec(str);
	var phoneNumber = phoneUtil.parse(str[0], 'US');
	res.send('your url is ' +req.url + ' phone number is ' +str[0] + " formated to be " + phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
	console.log(phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
	
});

app.listen(port);

console.log('starting on port ' +port);