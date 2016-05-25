version 0.7 features

-Expandable.
-Content agnostic.  Anything can go in a slide.
-Inline "jump-to" control buttons.
-Unobtrusive "Next" and "Previous" buttons.
-Automatically sizes to largest content.

version 0.8 features (changelog)

- Now sizes to content on each slide by default.  This can be overridden by applying static height and width values in the config.
- Slider now launches from a function call in order to allow configuration with parameters.  The first parameter needs to be the 
  unique ID of the <div> assigned as the slider(no #).  See the example below.
- added Config options:
	[parameter name]: [value]
	autoAdvance: "True", "False" (False by default)
	slideDelay: value in milliseconds (eg. 5000) (3000 by default)
	sliderHeight: "auto", non-decimal value (eg. 320) (Auto by default)
	sliderWidth: "auto", non-decimal value (eg. 320) (Auto by default)
	navButtons: "True", "False" (True by default)
	navArrows: "True", "False" (True by default)

example of configured function:
jasonSlider(mySlider, {
	autoAdvance: "True",
	slideDelay: 4000,
	navButtons: "False"
});

version 0.9 features

- Added swipe functionality for mobile users.  Because of issues with iframes, this means that video embeds using iframe will have 
  the arrow navigation up by default when they occur.
- Optimized the animation cylce to avoid jumping when switching between button and swipe navigation.
- Added checks in all other navigation so that the slide index updates after swiping.