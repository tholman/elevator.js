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
        if (!startTime) {
            startTime = time;
        }

        var timeSoFar = time - startTime;
        var easedPosition = easeInOutQuad(timeSoFar, startPosition, -startPosition, duration);                        
        
        window.scrollTo(0, easedPosition);

        if( timeSoFar < duration ) {
            requestAnimationFrame(animateLoop);
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

    function animationFinished() {
        startTime = null;
        startPosition = null;
        elevating = false;

        // Start music!
        if( mainAudio ) {
            mainAudio.pause();
            mainAudio.currentTime = 0;
        }

        if( endAudio ) {
            endAudio.play();
        }
    }

    //@TODO: Does this need tap bindings too?
    function bindElevateToElement( element ) {
        element.addEventListener('click', elevate, false);
    }

    function main( options ) {

        // Bind to element click event, if need be.
        body = document.body;

        if( options.element ) {
            bindElevateToElement( options.element );
        }

        if( options.duration ) {
            customDuration = true;
            duration = options.duration;
        }

        if( options.mainAudio ) {
            mainAudio = new Audio( options.mainAudio );
            mainAudio.setAttribute( 'preload', 'true' ); //@TODO: Option to not preload audio.
            mainAudio.setAttribute( 'loop', 'true' );
        }

        if( options.endAudio ) {
            endAudio = new Audio( options.endAudio );
            endAudio.setAttribute( 'preload', 'true' );
        }
    }

    return extend(main, {
        elevate: elevate
    });
})();
