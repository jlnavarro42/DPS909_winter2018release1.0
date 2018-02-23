var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const port = 3000;
//needed to upload and open files
var fs = require('fs'); //for opening files
//for uploading
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

app.listen(port, ()=>{
	console.log('starting on port ' +port);}
);

//cleanString function was not necessary when parsing, so I took it out

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/phonenumbers/parse/text/:numbers', function(req,res){
	//format the get request into something usable byut removing %20 and brackets/parenthesis
	
	try{
		//find the phone number
		str = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.exec(req.params.numbers);
		
		//parse the phonenumber
		var phoneNumber = phoneUtil.parse(str[0], 'US');
		var formatPhoneNumber = phoneUtil.format(phoneNumber, PNF.NATIONAL)
		//display phonenumber on screen

		res.status(200).json(formatPhoneNumber);
		console.log(formatPhoneNumber);
	}
	catch(err){
		console.log("failed to find phone number");
		res.status(204).send("no phonenumber!");
		//changed error code to 204 because 500 gives an internal server error, thus making the test crash
	}	
});

app.get('/api/phonenumbers/parse/file', (req,res) =>{
	res.sendFile(__dirname + "/post.html");
});

app.post('/api/phonenumbers/parse/file', upload.single('file'), function(req,res){
	var result = [];
	if(!req.file){
		res.status(400).send("No file found");
	}
	fs.readFile(req.file.path, (err, data)=>{
		if(err){
			throw(error);
		}
		else{
			var buf = Buffer.from(data, 'base64').toString();
			var phoneNumbersArray = buf.split('\n');
			for(var i = 0; i < phoneNumbersArray.length; i++){
				try{
					var phoneNumber = phoneUtil.parse(phoneNumbersArray[i], 'US');	
					var formatPhoneNumber = phoneUtil.format(phoneNumber, PNF.INTERNATIONAL);
					result.push(formatPhoneNumber);		
				}
				catch(error){
				
				}
			}
			console.log(result);
			res.status(200).json(result);
		}
	});
});
module.exports = app;