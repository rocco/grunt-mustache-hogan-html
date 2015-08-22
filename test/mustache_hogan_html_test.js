'use strict';

var grunt = require('grunt');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports.mustache_hogan_html = {

	// runs before each test
	setUp: function (done) {
		done();
	},

	// runs after each test
	tearDown : function (done) {
		done();
	},

	main_project: function (test) {

		test.expect(1);
		test.equal(
			grunt.file.read('test/dist/default.html'),
			grunt.file.read('test/expected/default.html'),
			'page content mismatch'
		);
		test.done();
	},

	sub_project_1: function (test) {

		test.expect(1);
		test.equal(
			grunt.file.read('test/dist/subproject1/index.html'),
			grunt.file.read('test/expected/subproject1/index.html'),
			'page content mismatch'
		);
		test.done();
	},

	sub_project_2: function (test) {

		test.expect(1);
		test.equal(
			grunt.file.read('test/dist/subproject2/index.html'),
			grunt.file.read('test/expected/subproject2/index.html'),
			'page content mismatch'
		);
		test.done();
	},

	sub_sub_project: function (test) {

		test.expect(1);
		test.equal(
			grunt.file.read('test/dist/subproject2/evensubbier/info.html'),
			grunt.file.read('test/expected/subproject2/evensubbier/info.html'),
			'page content mismatch'
		);
		test.done();
	}

};
