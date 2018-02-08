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

function cleanString(str){
	return str.replace(/%20/g, " ");
	
}
module.exports = cleanString;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/phonenumbers/parse/text/*', function(req,res){
	//formate the get request into something usable byut removing %20 and brackets/parenthesis
	var str = cleanString(req.url);
	
	try{
		//find the phone number
		str = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.exec(str);
		
		//parse the phonenumber
		var phoneNumber = phoneUtil.parse(str[0], 'US');
		var formatPhoneNumber = phoneUtil.format(phoneNumber, PNF.NATIONAL)
		//display phonenumber on screen
	
		var jsonPhoneNumber = {
			"phoneNumber": formatPhoneNumber,
		}
		
		res.status(200).json(jsonPhoneNumber);
		
		

		console.log(formatPhoneNumber);
	}
	catch(err){
		console.log("failed to find phone number");
		res.status(500).send("no phonenumber!");
	}	
	
});

app.get('/api/phonenumbers/parse/file', (req,res) =>{
	res.sendFile(__dirname + "/post.html");
});

app.post('/api/phonenumbers/parse/file', upload.single('file'), function(req,res){
	var result = [];
	fs.readFile(req.file.path, (err, data)=>{
		if(err){
			res.status(400).send("No file found");
		}
		else{
			//assuming the uploaded file is in regular text and not encoded in base64
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

app.listen(port);

console.log('starting on port ' +port);