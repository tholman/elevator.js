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

    // Thanks Mr Penner - http://robertpenner.com/easing/
    function easeInOutQuad( t, b, c, d ) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    /**
     * Main
     */

    // Time is passed through requestAnimationFrame, what a world!
    function animateLoop( time ) {
		if(!elevating) {
			return; // If animationFinished has been called then we should stop animating immediately
		}
	
        if (!startTime) {
            startTime = time;
        }

        var timeSoFar = time - startTime;
        var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);                        
        
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
		
		
		// If the user scrolls we should stop animating. It is bad for UX to ignore user input for more than 100ms: https://docs.google.com/document/d/1bYMyE6NdiAupuwl7pWQfB-vOZBPSsXCv57hljLDMV8E/edit
		var cancelOnScroll = function () {
            animationFinished(true);

            if (document.removeEventListener) {
                document.removeEventListener("mousewheel", cancelOnScroll, false); // IE9+, Chrome, Safari, Opera
                document.removeEventListener("DOMMouseScroll", cancelOnScroll, false); // Firefox
            }
            else
            {
                document.detachEvent("onmousewheel", cancelOnScroll); // IE 6/7/8
            }
        }
        if (document.addEventListener) {
            // IE9+, Chrome, Safari, Opera
            document.addEventListener("mousewheel", cancelOnScroll, false);
            // Firefox
            document.addEventListener("DOMMouseScroll", cancelOnScroll, false);
        }
		// IE 6/7/8
        else {
			document.attachEvent("onmousewheel", cancelOnScroll);
		}
    }

    function resetPositions() {
        startTime = null;
        startPosition = null;
        elevating = false;
    }

    function animationFinished(dontDing) {
        
        resetPositions();

        // Stop music!
        if( mainAudio ) {
            mainAudio.pause();
            mainAudio.currentTime = 0;
        }

        if( endAudio && !dontDing ) {
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
