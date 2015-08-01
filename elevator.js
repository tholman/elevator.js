/*!
 * Elevator.js
 *
 * MIT licensed
 * Copyright (C) 2015 Tim Holman, http://tholman.com
 */

/*********************************************
 * Elevator.js
 *********************************************/

var Elevator = function(options) {

    'use strict';

    // Elements
    var body = null;

    // Scroll vars
    var animation = null;
    var duration = null; // ms
    var customDuration = false;
    var startTime = null;
    var startPosition = null;
    var elevating = false;

    var mainAudio;
    var endAudio;

    var that = this;
    
    /**
     * Utils
     */

    // Thanks Mr Penner - http://robertpenner.com/easing/
    function easeInOutQuad( t, b, c, d ) {
        t /= d / 2;
        if ( t < 1 ) return c / 2 * t * t + b;
        t--;
        return -c / 2 * ( t * ( t -2 ) - 1 ) + b;
    }

    function extendParameters(options, defaults){
        for( var option in defaults ){
            var t = options[option] === undefined && typeof option !== "function";
            if(t){
                options[option] = defaults[option];
            }
        }
        return options;
    }

    /**
     * Main
     */

    // Time is passed through requestAnimationFrame, what a world!
    function animateLoop( time ) {
        if ( !startTime ) {
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
     }

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
    this.elevate = function() {

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
    };

    function browserMeetsRequirements() {
        return window.requestAnimationFrame && window.Audio && window.addEventListener;
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

    function bindElevateToElement( element ) {
        if( element.addEventListener ) {
            element.addEventListener('click', that.elevate, false);
        } else {
            // Older browsers
            element.attachEvent('onclick', function() {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                window.scroll(0, 0);
            });
        }
    }

    function init( _options ) {
        // Bind to element click event, if need be.
        body = document.body;

        var defaults = {
            duration: undefined,
            mainAudio: false,
            endAudio: false,
            preloadAudio: true,
            loopAudio: true,
        };

        _options = extendParameters(_options, defaults);

        if( _options.element ) {
            bindElevateToElement( _options.element );
        }

        // Take the stairs instead
        if( !browserMeetsRequirements() ) {
            return;
        }

        if( _options.duration ) {
            customDuration = true;
            duration = _options.duration;
        }

        window.addEventListener('blur', onWindowBlur, false);

        if( _options.mainAudio ) {
            mainAudio = new Audio( _options.mainAudio );
            mainAudio.setAttribute( 'preload', _options.preloadAudio );
            mainAudio.setAttribute( 'loop', _options.loopAudio );
        }

        if( _options.endAudio ) {
            endAudio = new Audio( _options.endAudio );
            endAudio.setAttribute( 'preload', 'true' );
        }
    }

    init(options);
};
