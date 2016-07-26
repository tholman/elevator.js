# elevator.js
Finally, a "back to top" button that behaves like a real elevator, by adding elevator music to quietly soothe the awkwardness that can ensue when being smoothly scrolled to the top of the screen.

This is very serious stuff, [here's a demo](http://tholman.com/elevator.js)!

### Instructions

`Elevator.js` is a stand alone library (no jquery, or the likes) so usage is pretty straight forward. All styling of elements is up to you. `Elevator.js` only handles the audio management, and the scroll functionality!

#### JS

`Elevator.js` lives entirely within the js realm, which makes things fairly simple to use.

You'll need to create a new instance of `Elevator`, and pass it some audio elements.

```html
<script>
// Elevator script included on the page, already.

window.onload = function() {
  var elevator = new Elevator({
    mainAudio: '/src/to/audio.mp3',
    endAudio: '/src/to/end-audio.mp3'
  });
}

// You can run the elevator, by calling.
elevator.elevate();
</script>
```

You can also add an "element" option, clicking this element will invoke the "Scroll to top" functionality, we all love and crave.
```html
<div class="elevator-button">Back to Top</div>

<script>
// Elevator script included on the page, already.

window.onload = function() {
  var elevator = new Elevator({
    element: document.querySelector('.elevator-button'),
    mainAudio: '/src/to/audio.mp3',
    endAudio: '/src/to/end-audio.mp3'
  });
}
</script>
```

If you don't want to scroll to the top, a custom target can be specified by adding a "targetElement" option:
```html
<div class="elevator-button">Take the elevator to the target</div>

<script>
// Elevator script included on the page, already.

window.onload = function() {
  var elevator = new Elevator({
    element: document.querySelector('.elevator-button'),
    targetElement: document.querySelector('#elevator-target'),
    mainAudio: '/src/to/audio.mp3',
    endAudio: '/src/to/end-audio.mp3'
  });
}
</script>
```

If you want to scroll to a point on the page with some extra padding on the top, simply add the "verticalPadding" option:

```html
<div class="elevator-button">Take the elevator to the target</div>

<script>
// Elevator script included on the page, already.

window.onload = function() {
  var elevator = new Elevator({
    element: document.querySelector('.elevator-button'),
    targetElement: document.querySelector('#elevator-target'),
    verticalPadding: 100,  // in pixels
    mainAudio: '/src/to/audio.mp3',
    endAudio: '/src/to/end-audio.mp3'
  });
}
</script>
```

If you're really serious (boring), you don't have to use audio... and can also set a fixed time to scroll to the top
```html
<div class="elevator-button">Back to Top</div>

<script>
// Elevator script included on the page, already.

window.onload = function() {
  var elevator = new Elevator({
    element: document.querySelector('.elevator-button'),
    duration: 1000 // milliseconds
  });
}
</script>
```

If you use elevator.js in combination with other code, you might want to use callbacks
```html
<script>
window.onload = function() {
   new Elevator({
       element: document.querySelector('.elevator-button'),
       mainAudio: '/src/to/audio.mp3',
       endAudio: '/src/to/end-audio.mp3',
       duration: 5000,
       startCallback: function() {
         // is called, when the elevator starts moving
       },
       endCallback: function() {
         // is called, when the elevator reached target level
       }
   });
}
</script>
```

### NPM
The package is also available via [NPM](https://www.npmjs.com/package/elevator.js)

### License

Elevator.js is covered by the MIT License.

Audio in the Demo (sourced from [BenSound](http://www.bensound.com/)) is licenced under [Creative Commons](http://www.bensound.com/licensing).

Copyright (C) 2015 ~ [Tim Holman](http://tholman.com) ~ timothy.w.holman@gmail.com
