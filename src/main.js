'use strict';

var optimist = require('optimist');
var watch = require('./watch');
var compile = require('./compile');

exports.processCommandLine = function () {
	var argv = optimist
		.usage('Preprocessor for JavaScript.\n\nUsage:\njas --watch myfile.jas -o myfile.js\njas --compile myfile.jas -o myfile.js')
		.alias('w', 'watch')
		.describe('w', 'File or directory for watching')
		.alias('c', 'compile')
		.describe('c', 'File or directory for compiling')
		.alias('o', 'output')
		.describe('o', 'Output file or directory')
		.argv;

	if (argv.watch) {
		watch.start(argv.watch, argv.output);
	}
	else if (argv.compile) {
		compile.start(argv.compile, argv.output);
	}
	else {
		optimist.showHelp();
		process.exit(1);
	}
};

exports.watch = watch.start.bind(watch);

exports.compile = compile.start.bind(compile);

exports.showHelp = optimist.showHelp.bind(optimist);
