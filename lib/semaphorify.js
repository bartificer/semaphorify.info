// The Semaphorify JavaScript library - code for converting text to semaphore
// Copy Right Bart Busschots 2014 - All Rights Reserved

//
// The Semaphorify singleton that will contain all the code
//

// Data definitions
var Semaphorify = {
	version: 0.1,
	symbolMap: {
		A: {name: 'A', img: '/semaphores/a.png'},
		B: {name: 'B', img: '/semaphores/b.png'},
		C: {name: 'C', img: '/semaphores/c.png'},
		D: {name: 'D', img: '/semaphores/d.png'},
		E: {name: 'E', img: '/semaphores/e.png'},
		F: {name: 'F', img: '/semaphores/f.png'},
		G: {name: 'G', img: '/semaphores/g.png'},
		H: {name: 'H', img: '/semaphores/h.png'},
		I: {name: 'I', img: '/semaphores/i.png'},
		J: {name: 'J', img: '/semaphores/j.png'},
		K: {name: 'K', img: '/semaphores/k.png'},
		L: {name: 'L', img: '/semaphores/l.png'},
		M: {name: 'M', img: '/semaphores/m.png'},
		N: {name: 'N', img: '/semaphores/n.png'},
		O: {name: 'O', img: '/semaphores/o.png'},
		P: {name: 'P', img: '/semaphores/p.png'},
		Q: {name: 'Q', img: '/semaphores/q.png'},
		R: {name: 'R', img: '/semaphores/r.png'},
		S: {name: 'S', img: '/semaphores/s.png'},
		T: {name: 'T', img: '/semaphores/t.png'},
		U: {name: 'U', img: '/semaphores/u.png'},
		V: {name: 'V', img: '/semaphores/v.png'},
		W: {name: 'W', img: '/semaphores/w.png'},
		X: {name: 'X', img: '/semaphores/x.png'},
		Y: {name: 'Y', img: '/semaphores/y.png'},
		Z: {name: 'Z', img: '/semaphores/z.png'},
		0: {name: 'Zero', img: '/semaphores/0.png'},
		1: {name: 'One', img: '/semaphores/1.png'},
		2: {name: 'Two', img: '/semaphores/2.png'},
		3: {name: 'Three', img: '/semaphores/3.png'},
		4: {name: 'Four', img: '/semaphores/4.png'},
		5: {name: 'Five', img: '/semaphores/5.png'},
		6: {name: 'Six', img: '/semaphores/6.png'},
		7: {name: 'Seven', img: '/semaphores/7.png'},
		8: {name: 'Eight', img: '/semaphores/8.png'},
		9: {name: 'Nine', img: '/semaphores/9.png'},
		SPACE: {name: 'Space', img: '/semaphores/_space.png'},
		LETTERS: {name: 'Letters Mode', img: '/semaphores/_letters.png'},
		NUMBERS: {name: 'Numbers Mode', img: '/semaphores/_numbers.png'},
		REST: {name: 'Rest', img: '/semaphores/_space.png'},
		ERROR: {name: 'ERROR', img: '/semaphores/_error.png'}
	},
	doDebug: false,
	debug: function(msg){
		if(this.doDebug && console){
			console.log('DEBUG - ' + msg);
		}
	},
	warn: function(msg){
		if(console){
			console.log('WARNING - ' + msg);
		}
	}
};

//
// public function definitions
//

// A function to check that a string contains only characters that can be
// represented in semaphore.
// Arguments:
// 1) the text to validate
// Returns: true or false
Semaphorify.isValidInput = function (inputText){
	// convert the input to a string
	var inputString = String(inputText);
	
	// check we have all valid characters
	if(inputString.match(/^[a-zA-Z0-9 ]*$/)){
		return true;
	}
	
	// default to false
	return false;
}

// A function to convert a string to an array of HTML image tags.
// Arguments:
// 1) a string to convert
// Returns: an array of HTML strings, including a 'Rest' flag at the end
Semaphorify.toHTMLSeries = function (inputText){
	// validate the input - if invalid, return the error semaphore
	if(!this.isValidInput(inputText)){
		this.debug('Semaphorify.toHTMLSeries(): invalid input - returning error flag');
		return [this._getIMG('ERROR')];
	}
	
	// parse the input
	var flagSeries = [];
	try{
		flagSeries = this._parse(inputText);
	}catch(Err){
		this.warn('Semaphorify.toHTMLSeries(): failed to parse input with error: ' + Err.message);
		return [this._getIMG('ERROR')];
	}
	
	// convert the parsed input to HTML tags
	var htmlSeries = [];
	try{
		for(var i = 0; i < flagSeries.length; i++){
			htmlSeries.push(this._getIMG(flagSeries[i]));
		}
	}catch(Err){
		this.warn('Semaphorify.toHTMLSeries(): failed to generate HTML with error: ' + Err.message);
		return [this._getIMG('ERROR')];
	}
	
	// return the array of HTML tags
	this.debug('Semaphorify.toHTMLSeries(): returning ' + htmlSeries.length + ' img tags');
	return htmlSeries;
}

// A function to convert a string to a series of HTML image tags.
// Arguments:
// 1) a string to convert
// Returns: a string of HTML, including a 'rest' flag at the end
Semaphorify.toHTML = function (inputText){
	return this.toHTMLSeries(inputText).join('');
}

//
// Private helper function definitions
//

// A private function to parse a string into a series of flag identifiers
// Arguments:
// 1) a string to convert
// Returns: an array of strings, each a semaphore flag identifier
// Throws: a new Error if invoked with an invalid string
Semaphorify._parse = function (inputText){
	// validate the input - if invalid, throw an Error
	if(!this.isValidInput(inputText)){
		throw new Error('Semaphorify._parse(): received invalid input');
	}
	
	// TO DO - add support for special flags
	
	// step through the input character by character
	var inputString = String(inputText); // make sure we are working on a string
	var curMode = 'S'; // start in S mode (start) - can also be L (letter) and N (numbers)
	var output = [];
	for(var i = 0; i < inputString.length; i++){
		var c = inputString.charAt(i).toUpperCase();
		if(c == ' '){
			// if the current character is a space, add rest and set mode to S
			output.push('SPACE');
			curMode = 'S';
		}else if(c.match(/^[A-Z]$/)){
			// if we are not in text mode, switch to it
			if(curMode != 'L'){
				output.push('LETTERS');
				curMode = 'L';
			}
				
			// add the letter
			output.push(c);
		}else if(c.match(/^[0-9]$/)){
			// if we are not in numbers mode, switch to it
			if(curMode != 'N'){
				output.push('NUMBERS');
				curMode = 'N';
			}
				
			// add the number
			output.push(c);
		}else{
			// it should not be possible to get here, but just in case, throw an Error
			throw new Error('Semaphorify._parse(): received invalid input');
		}
	}
		
	// add a rest character to the end
	output.push('REST');
	
	// return the parsed output
	this.debug('Semaphorify._parse(): returning ' + output.length + ' flag identifiers (' + output.join(', ') + ')');
	return output;
}


// A private function to generate the HTML for a single semaphore image
// Arguments:
// 1) the identifier of the desired flag
// Returns: an HTML string
// Throws: a new Error if invoked with an invalid flag identifier
Semaphorify._getIMG = function (flagID){
	// see if there is a flag with the desired ID in the symbol table
	var flag = this.symbolMap[flagID];
	
	// if there is no matching flag in the symbol table, throw an Error
	if(!flag){
		throw new Error("Semaphorify._getIMG(): received invalid flag identifier (" + flagID + ")");
	}
	
	// generate the img tag and return it
	var html = '<img src="' + flag.img + '" alt="' + flag.name + '" class="sem_flag" />';
	this.debug('Semaphorify._getIMG(): returning html=' + html);
	return html;
}
