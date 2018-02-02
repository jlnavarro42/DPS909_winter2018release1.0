var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const port = 3000;

var jsonPhoneNumber = {
	"areaCode": null,
	"number": null
}

function cleanString(str){
	return str.replace(/%20/g, " ");
	
}
module.exports = cleanString;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/*', function(req,res){
	//formate the get request into something usable byut removing %20 and brackets/parenthesis
	var str = cleanString(req.url);
	
	try{
		//find the phone number
		str = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.exec(str);
		
		//parse the phonenumber
		var phoneNumber = phoneUtil.parse(str[0], 'US');
		
		//display phonenumber on screen
	
		res.status(200).json(phoneNumber);
		
		console.log(phoneUtil.format(phoneNumber, PNF.INTERNATIONAL));
	}
	catch(err){
		console.log("failed to find phone number");
		res.status(500).send("no phonenumber!");
	}	
	
});

app.post('/*', function(req,res){
	var str = req.body.phoneNumber;
	var phoneNumber = phoneUtil.parse(str, 'US');
	var result = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
	
	res.status(200).json(phoneNumber);
	console.log(result);
});

app.listen(port);

console.log('starting on port ' +port);