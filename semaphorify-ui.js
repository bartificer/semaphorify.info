// Event handlers for UI on Semaphorify.info

//
// Define Variables
//

// to keep the namespace clean, wrap the needed variables and utility function
// into a singleton.
var Semaphorify_local = {
	validationImages: {
		ok: '/contrib/famfamfam_silk_icons_v013/tick.png',
		invalid: '/contrib/famfamfam_silk_icons_v013/cross.png',
	},
	aniTime: 250,
	validateFormElement: function($formElement, validationFunction){
		var formElementID = $formElement.attr('id');
		var $icon = $('#' + formElementID + '_vi');
		var $validationText = $('#' + formElementID + '_vt');
		if(validationFunction($formElement.val())){
			$icon.attr('src', this.validationImages.ok);
			$validationText.hide(this.aniTime);
			this.$convert.prop('disabled', false);
		}else{
			$icon.attr('src', this.validationImages.invalid);
			$validationText.show(this.aniTime);
			this.$convert.prop('disabled', true);
		}
	},
	animation: {
		images: [],
		counter: 0,
		frameTime: 1000
	},
	loadConversion: function(flagArray){
		// store the images
		this.animation.images = flagArray;
		
		// set the animation pointer to 0
		this.animation.counter = 0;
		
		// render the static output
		var staticFlags = this.animation.images.slice(0);
		staticFlags.pop();
		this.$output.html(staticFlags.join(''));
		
		// render the share link
		this.$shareLink.val('http://semaphorify.info/?c=' + encodeURIComponent(this.$input.val()));
		
		// enable the play button
		this.$play.prop('disabled', false);
	},
	startAnimation: function(){
		this.$play.prop('disabled', true);
		this.$convert.prop('disabled', true);
		setTimeout(this.renderAnimationFrame, this.animation.frameTime);
	},
	renderAnimationFrame: function(){
		// render the current frame
		Semaphorify_local.$animation.html(Semaphorify_local.animation.images[Semaphorify_local.animation.counter]);
		Semaphorify_local.$animationText.html("'" + $('img', Semaphorify_local.$animation).attr('alt') + "'");
		
		// see if there is another frame to render
		if(Semaphorify_local.animation.counter < Semaphorify_local.animation.images.length){
			// update the counter and start a timeout
			Semaphorify_local.animation.counter++;
			setTimeout(Semaphorify_local.renderAnimationFrame, Semaphorify_local.animation.frameTime);
		}else{
			// end the animation
			Semaphorify_local.animation.counter = 0;
			Semaphorify_local.$play.prop('disabled', false);
			Semaphorify_local.$convert.prop('disabled', false);
		}
	}
}

//
// Attach the needed event handlers on page load
//
$(document).ready(function(){
	// save a links to the convert button and IO areas in the local singleton
	Semaphorify_local.$convert = $('#sem_convert');
	Semaphorify_local.$play = $('#sem_play');
	Semaphorify_local.$input = $('#sem_input');
	Semaphorify_local.$output = $('#sem_out');
	Semaphorify_local.$animation = $('#sem_ani');
	Semaphorify_local.$animationText = $('#sem_ani_text');
	Semaphorify_local.$shareLink = $('#sem_share_link');
	
	// add validation to the input text area
	Semaphorify_local.$input.keyup(function(){
		Semaphorify_local.validateFormElement($(this), Semaphorify.isValidInput);
	});
	
	// add functionality to the convert button
	Semaphorify_local.$convert.click(function(){
		Semaphorify_local.loadConversion(Semaphorify.toHTMLSeries(Semaphorify_local.$input.val()));
	});
	
	// add functionality to the play button
	Semaphorify_local.$play.click(function(){
		Semaphorify_local.startAnimation();
	});
	
	// check if a string was passed as a URL parameter
	$url = $.url();
	var convertString = $url.param('c');
	if(convertString && Semaphorify.isValidInput(convertString)){
		// load the string
		Semaphorify_local.$input.val(convertString);
		Semaphorify_local.$convert.click();
	}
});