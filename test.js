var expect = require('chai').expect;
var cleanString = require("./app");

describe('cleanString()', function (){
	it('should remove %20 from strings', function() {
		var str = '111%20222%203333';
		
		var check = '111 222 3333';
		
		var result = cleanString(str);
		
		expect(result).to.be.equal(check);
	});
});