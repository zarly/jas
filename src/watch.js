'use strict';

var fs = require('fs');
var watch = require('watch');
var compile = require('./compile');

exports.start = function (input, output) {
	watchForJasFiles(input, function (filename, curr, prev) {
		compile.start(filename, output);
	});
};

function watchForJasFiles (path, onChange) {
	var jasRegExp = /.jas$/;
	fs.stat(path, function (err, stats) {
		if (err) {
			console.error(err);
			process.exit(2);
		}
		else if (stats.isFile()) {
			fs.watchFile(path, {}, function (curr, prev) {
				console.log('file changed:', path);
				onChange(path, curr, prev);
			});
		}
		else if (stats.isDirectory()) {
			watch.watchTree(path, {
				filter: function (name, stats) {
					if (stats.isFile()) {
						return jasRegExp.test(name)
					}
					else if (stats.isDirectory()) {
						return true;
					} else {
						return false;
					}
				}
			}, function (f, curr, prev) {
				if ('string' === typeof f) {
					console.log('file changed:', f);
					onChange(f, curr, prev);
				}
				else {
					console.log('some changes:', typeof f); //TODO: explore why here not string
				}
			});
		}
		else if (stats.isBlockDevice()) {
			console.warn('%s is block device. Can not handle block devices.', path);
		}
		else if (stats.isCharacterDevice()) {
			console.warn('%s is character device. Can not handle character devices.', path);
		}
		else if (stats.isFIFO()) {
			console.warn('%s is FIFO. Can not handle FIFOs.', path);
		}
		else if (stats.isSocket()) {
			console.warn('%s is socket. Can not handle sockets.', path);
		}
		else {
			console.warn('Unexpected type of %s', path);
		}
	});
}
