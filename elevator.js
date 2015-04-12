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
    var body = document.body;

    // Scroll vars
    var animation = null;
    var duration = 5000; // ms
    var customDuration = false;
    var startTime = null;
    var startPosition = null;

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
        body.scrollTop = easedPosition

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
        startPosition = body.scrollTop;
        requestAnimationFrame( animateLoop );

        // Start music!
    }

    function animationFinished() {
        startTime = null;
        startPosition = null;
    }

    function main( options ) {

        // Bind to element click event, if need be.

        // Custom Duration, if need be

        // Music file, 100% needed... create element here.
    }

    return extend(main, {
        elevate: elevate
    });
});