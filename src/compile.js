'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');

exports.start = function (input, output) {
	convert(input, function (err, result) {
		if (err) {
			console.warn(err);
		}
		else {
			output = getOutputFileName(input, output);
			fs.writeFile(output, result, function (err) {
				if (err) {
					console.warn(err);
				}
				else {
					console.log('File %s complied to %s', input, output);
				}
			});
		}
	});
};

function convert (filename, callback) {
	fs.readFile(filename, {}, function (err, data) {
		if (err) {
			console.warn(err);
			callback(err, '');
		}
		else {
			applyDependencies(filename, data.toString(), function (err, code) {
				callback(err, code);
			});
		}
	});
}

function applyDependencies (filename, content, callback) {
	var matches = content.match(/@import\s(.+?);/g) || [];

	async.each(matches, function (cmd, done) {
		var imported = cmd.match(/@import\s(.+?);/)[1];
		imported = getImportFileName(filename, imported);
		convert(imported, function (err, result) {
			if (err) {
				done(err);
			}
			else {
				content = content.replace(cmd, result);
				done(null);
			}
		});
	}, function (err) {
		callback(err, content);
	});
}

function getImportFileName (initial, imported) {
	initial = path.dirname(initial);

	var result = path.join(initial, imported);
	result = path.normalize(result);

	return result;
}

function getOutputFileName (input, output) {
	if (output) {
		return output;
	}
	else if (/\.jas$/.test(input)) {
		return input.replace(/\.jas$/, '.js');
	}
	else {
		return input + '.js';
	}
}
