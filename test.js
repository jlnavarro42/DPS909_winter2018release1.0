var chai = require('chai');
var chaiHttp = require('chai-http');
var fs = require('fs');
var expect = require('chai').expect;
chai.use(chaiHttp);
var app = require("./app.js");

//took out the tester for the clean string since there was no use for the function

describe('GET /', () => {
    it('should return no phonenumber', () => {return chai.request(app)
        .get('/api/phonenumbers/parse/text/qeqwadzxc')
        .then(res =>{
			expect(res).to.have.status(204);
        });
    });   
});

describe('GET /api/phonenumbers/parse/text/Seneca%20Phone%20Number%3A%20416-491-5050', () => {
    it('should return (416) 491-5050', () => {return chai.request(app)
        .get('/api/phonenumbers/parse/text/Seneca%20Phone%20Number%3A%20416-491-5050')
        .then(res =>{
            expect(res).to.have.status(200);
			expect(res.body).to.include('(416) 491-5050');
        });
    });
});

describe('POST /api/phonenumbers/parse/file', () =>{
    it('should return [(905) 123-1234, (123) 456-7890]', () => {return chai.request(app)
        .post('/api/phonenumbers/parse/file')
        .set('Content-Type','text/plain')
        .attach('file', fs.readFileSync('./phnumbers.txt'), 'phoneNumber.txt')
        .then(res =>{
            expect(res).to.have.status(200);
            expect(res.body).to.include('+1 123-123-1234','+1 416-345-9483');
        });

    });
});