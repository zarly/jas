jas
===

Preprocessor for JavaScript

### Installation
```
npm install -g jas
```

### Usage
```
jas --compile myfile.jas
jas --watch myfile.jas
jas --watch mydir
jas --compile myfile.jas --output output.js
```

### Syntax
```
@import ../src/main.js;

@define('->', 'function'); //in progress yet, join us to implement

@define('DEBUG_MODE', 'true');
@if(DEBUG_MODE) //in progress yet, join us to implement
	console.trace('Message');
@else
	showErrorDialog();
@end
```
