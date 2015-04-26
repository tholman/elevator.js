/*!
 * Elevator.js
 *
 * MIT licensed
 * Copyright (C) 2015 Tim Holman, http://tholman.com
 */

/*********************************************
 * Elevator.js
 *********************************************/

 var Elevator = (function() {

 	'use strict';

    // Elements
    var body = null;

    // Scroll vars
    var animation = null;
    var duration = null; // ms
    var customDuration = false;
    var startTime = null;
    var startPosition = null;

    var mainAudio;
    var endAudio;

    var elevating = false;

    /**
     * Utils
     */

    // Soft object augmentation
    function extend( target, source ) {
    	for ( var key in source ) {
    		if ( !( key in target ) ) {
    			target[ key ] = source[ key ];
    		}
    	}
    	return target;
    };

    // Thanks Mr. Robert Penner - http://robertpenner.com/easing/
    function easeInQuad (t, b, c, d) {
    	return c*(t/=d)*t + b;
    };

    function easeOutQuad (t, b, c, d) {
    	return -c *(t/=d)*(t-2) + b;
    };

    function easeInOutQuad (t, b, c, d) {
    	if ((t/=d/2) < 1) return c/2*t*t + b;
    	return -c/2 * ((--t)*(t-2) - 1) + b;
    };

    function easeInCubic (t, b, c, d) {
    	return c*(t/=d)*t*t + b;
    };

    function easeOutCubic (t, b, c, d) {
    	return c*((t=t/d-1)*t*t + 1) + b;
    };

    function easeInOutCubic (t, b, c, d) {
    	if ((t/=d/2) < 1) return c/2*t*t*t + b;
    	return c/2*((t-=2)*t*t + 2) + b;
    };

    function easeInQuart (t, b, c, d) {
    	return c*(t/=d)*t*t*t + b;
    };

    function easeOutQuart (t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    };

    function easeInOutQuart (t, b, c, d) {
    	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    	return -c/2 * ((t-=2)*t*t*t - 2) + b;
    };

    function easeInQuint (t, b, c, d) {
    	return c*(t/=d)*t*t*t*t + b;
    };

    function easeOutQuint (t, b, c, d) {
    	return c*((t=t/d-1)*t*t*t*t + 1) + b;
    };

    function easeInOutQuint (t, b, c, d) {
    	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    	return c/2*((t-=2)*t*t*t*t + 2) + b;
    };

    function easeInSine (t, b, c, d) {
    	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    };

    function easeOutSine (t, b, c, d) {
    	return c * Math.sin(t/d * (Math.PI/2)) + b;
    };

    function easeInOutSine (t, b, c, d) {
    	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    };

    function easeInExpo (t, b, c, d) {
    	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    };

    function easeOutExpo (t, b, c, d) {
    	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    };

    function easeInOutExpo (t, b, c, d) {
    	if (t==0) return b;
    	if (t==d) return b+c;
    	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    };

    function easeInCirc (t, b, c, d) {
    	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    };

    function easeOutCirc (t, b, c, d) {
    	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    };

    function easeInOutCirc (t, b, c, d) {
    	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    };

    function easeInElastic (t, b, c, d) {
    	var s=1.70158;var p=0;var a=c;
    	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    	if (a < Math.abs(c)) { a=c; var s=p/4; }
    	else var s = p/(2*Math.PI) * Math.asin (c/a);
    	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    };

    function easeOutElastic (t, b, c, d) {
    	var s=1.70158;var p=0;var a=c;
    	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    	if (a < Math.abs(c)) { a=c; var s=p/4; }
    	else var s = p/(2*Math.PI) * Math.asin (c/a);
    	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    };

    function easeInOutElastic (t, b, c, d) {
    	var s=1.70158;var p=0;var a=c;
    	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    	if (a < Math.abs(c)) { a=c; var s=p/4; }
    	else var s = p/(2*Math.PI) * Math.asin (c/a);
    	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    };

    function easeInBack (t, b, c, d, s) {
    	if (s == undefined) s = 1.70158;
    	return c*(t/=d)*t*((s+1)*t - s) + b;
    };

    function easeOutBack (t, b, c, d, s) {
    	if (s == undefined) s = 1.70158;
    	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    };

    function easeInOutBack (t, b, c, d, s) {
    	if (s == undefined) s = 1.70158; 
    	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    };

    function easeOutBounce (t, b, c, d) {
    	if ((t/=d) < (1/2.75)) {
    		return c*(7.5625*t*t) + b;
    	} else if (t < (2/2.75)) {
    		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    	} else if (t < (2.5/2.75)) {
    		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    	} else {
    		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    	}
    };

    function easeInBounce (t, b, c, d) {
    	return c - easeOutBounce (d-t, 0, c, d) + b;
    };

    function easeInOutBounce (t, b, c, d) {
    	if (t < d/2) return easeInBounce (t*2, 0, c, d) * .5 + b;
    	return easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
    }

    /**
     * Main
     */

    // Time is passed through requestAnimationFrame, what a world!
    function animateLoop( time ) {
    	if (!startTime) {
    		startTime = time;
    	}

    	var timeSoFar = time - startTime;

    	// Different Animation Styles
    	switch (document.getElementById("animStyle").value) {
    		case 'OP1': {
    			document.getElementById("animStyle").value = "OP" + Math.floor((Math.random() * 30) + 2);
    			break;
    		}
    		case 'OP2':
    			var easedPosition = easeInSine(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP3':
    			var easedPosition = easeOutSine(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP4':
    			var easedPosition = easeInOutSine(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP5':
    			var easedPosition = easeInQuad(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP6':
    			var easedPosition = easeOutQuad(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP7':
    			var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP8':
    			var easedPosition = easeInCubic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP9':
    			var easedPosition = easeOutCubic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP10':
    			var easedPosition = easeInOutCubic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP11':
    			var easedPosition = easeInQuart(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP12':
    			var easedPosition = easeOutQuart(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP13':
    			var easedPosition = easeInOutQuart(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP14':
    			var easedPosition = easeInQuint(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP15':
    			var easedPosition = easeOutQuint(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP16':
    			var easedPosition = easeInOutQuint(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP17':
    			var easedPosition = easeInExpo(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP18':
    			var easedPosition = easeOutExpo(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP19':
    			var easedPosition = easeInOutExpo(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP20':
    			var easedPosition = easeInCirc(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP21':
    			var easedPosition = easeOutCirc(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP22':
    			var easedPosition = easeInOutCirc(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP23':
    			var easedPosition = easeInBack(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP24':
    			var easedPosition = easeOutBack(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP25':
    			var easedPosition = easeInOutBack(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP26':
    			var easedPosition = easeInElastic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP27':
    			var easedPosition = easeOutElastic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP28':
    			var easedPosition = easeInOutElastic(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP29':
    			var easedPosition = easeInBounce(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP30':
    			var easedPosition = easeOutBounce(timeSoFar, startPosition, -startPosition, duration);
    			break;
    		case 'OP31':
    			var easedPosition = easeInOutBounce(timeSoFar, startPosition, -startPosition, duration);
    			break;

    		default:
    			var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);
    			break;
    	}

    	window.scrollTo(0, easedPosition);

    	if( timeSoFar < duration ) {
    		animation = requestAnimationFrame(animateLoop);
    	} else {
    		animationFinished();
    	}
    };

//            ELEVATE!
//              /
//         ____
//       .'    '=====<0
//       |======|
//       |======|
//       [IIIIII[\--()
//       |_______|
//       C O O O D
//      C O  O  O D
//     C  O  O  O  D
//     C__O__O__O__D
//    [_____________]
function elevate() {

	if( elevating ) {
		return;
	}

	elevating = true;
	startPosition = (document.documentElement.scrollTop || body.scrollTop);

        // No custom duration set, so we travel at pixels per millisecond. (0.75px per ms)
        if( !customDuration ) {
        	duration = (startPosition * 1.5);
        }

        requestAnimationFrame( animateLoop );

        // Start music!
        if( mainAudio ) {
        	mainAudio.play();
        }
    }

    function resetPositions() {
    	startTime = null;
    	startPosition = null;
    	elevating = false;
    }

    function animationFinished() {

    	resetPositions();

        // Stop music!
        if( mainAudio ) {
        	mainAudio.pause();
        	mainAudio.currentTime = 0;
        }

        if( endAudio ) {
        	endAudio.play();
        }
    }

    function onWindowBlur() {

        // If animating, go straight to the top. And play no more music.
        if( elevating ) {

        	cancelAnimationFrame( animation );
        	resetPositions();

        	if( mainAudio ) {
        		mainAudio.pause();
        		mainAudio.currentTime = 0;
        	}

        	window.scrollTo(0, 0);
        }
    }

    //@TODO: Does this need tap bindings too?
    function bindElevateToElement( element ) {
    	element.addEventListener('click', elevate, false);
    }

    function extendParameters(options, defaults){
    	for(var option in defaults){
    		var t = options[option] === undefined && typeof option !== "function";
    		if(t){
    			options[option] = defaults[option];
    		}
    	}
    	return options;
    }

    function main( options ) {

        // Bind to element click event, if need be.
        body = document.body;

        var defaults = {
        	duration: undefined,
        	mainAudio: true,
        	preloadAudio: true,
        	loopAudio: true,
        	endAudio: true
        };

        options = extendParameters(options, defaults);
        

        if( options.element ) {
        	bindElevateToElement( options.element );
        }

        if( options.duration ) {
        	customDuration = true;
        	duration = options.duration;
        }

        if( options.mainAudio ) {
        	mainAudio = new Audio( options.mainAudio );
        	mainAudio.setAttribute( 'preload', options.preloadAudio ); 
        	mainAudio.setAttribute( 'loop', options.loopAudio );
        }

        if( options.endAudio ) {
        	endAudio = new Audio( options.endAudio );
        	endAudio.setAttribute( 'preload', 'true' );
        }

        window.addEventListener('blur', onWindowBlur, false);
    }

    return extend(main, {
    	elevate: elevate
    });
})();
