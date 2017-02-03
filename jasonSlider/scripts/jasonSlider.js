/************
Slider code
*************/
function jasonSlider(element, options) {
	//set defaults
	var autoAdvanceTrigger = options.autoAdvance || "False";
	var slideDelay = options.slideDelay || 3000;
	var sliderHeight = options.sliderHeight || "auto";
	var sliderWidth = options.sliderWidth || "auto";
	var showNavButtons = options.navButtons || "True";
	var showNavArrows = options.navArrows || "True";
	var infoAlwaysOn = options.infoAlwaysOn || "False";
	var index; //slide index variable
	var toggleState; //info button togglestate
	//Make the parent div into the slider
	var slider = $(element);
	slider.addClass("jasonSlider");
	/**********************************
	Build the structure
	**********************************/
	$(".jasonSlider").children("div").addClass("contentSlide animated");
	var maxindex = $(".contentSlide").length; //set total number of slides
	$(".jasonSlider").children("div").each(function(i) {
		$(this).attr("id", "slide-" + i + "");
	});
	//If lower nav buttons are enabled, build them
	if (showNavButtons == "True") {
		//wrapper for slide select controls
		$(".jasonSlider").append("<div id='slideSelection'></div>");
		//slide select controls
		for (i = 0; i <= maxindex - 1; i++) {
			$("<div class='slideSelectBTN' id='control-" + i + "'></div>").appendTo("#slideSelection");
		}
		//add info button
		$("<div class='js-info'></div>").appendTo("#slideSelection");
		//Set the initial button state for the first slide
		$("#control-0").css('background', 'url("./images/select-button-ON.png")');
	}
	//Add the animation class to all captions
	$(".js-caption").addClass("animated");
	//If info captions are set to be always on, reverse the default info button state
	if (infoAlwaysOn == "False") {
		$(".js-caption").css("opacity", "0"); //hide the captions
		$(".js-info").css("opacity", "1"); //show info button
	} else if (infoAlwaysOn == "True") {
		$(".js-caption").css("opacity", "1"); //show the captions
		$(".js-info").css("opacity", "0"); //hide info button
	}
	//Function to control info button display on a slide-by-slide basis
	function showInfoButton() {
		if ($("#slide-" + index + "").children("p").hasClass("js-caption")) {
			$(".js-info").css("opacity", "1");
		} else {
			$(".js-info").css("opacity", "0");
		}
	}
	//Size the slider wrapper to the largest high/width of its children
	var heights = $(".contentSlide").siblings().map(function() {
		return $(this).height();
	});
	var widths = $(".contentSlide").siblings().not("#slideSelection").map(function() {
		return $(this).width();
	});
	//set height/width variables
	var currentHeight = 0;
	var currentWidth = 0;
	//Height and Width calculation functions
	function autoSetHeight(i) {
		//Height
		currentHeight = $("#slide-" + i + "").height();
		if (showNavButtons == "True") {
			currentHeight = currentHeight + 35; //make room for the control buttons.
		}
		$(".jasonSlider").animate({
			height: currentHeight
		});
	}

	function autoSetWidth(i) {
		//Width
		currentWidth = $("#slide-" + i + "").width();
		//If the contents is an iframe, push out the static controls so the video player controls are not blocked.
		if ($(".visibleSlide").children().is("iframe")) {
			$(".jasonSlider").animate({
				width: currentWidth
			}, {
				queue: false,
				complete: function() {
					$("#modalLeft").animate({
						left: -32
					}, {
						queue: false
					});
					$("#modalRight").animate({
						right: -32
					}, {
						queue: false
					});
					setTimeout(function() {
						$(".jasonSlider").css("overflow", "visible");
					}, 600); //Timeout allows time for sliding animation to complete before revealing nav buttons
				}
			});
		} else {
			$(".jasonSlider").css("overflow", "hidden");
			$(".jasonSlider").animate({
				width: currentWidth
			}, {
				queue: false
			});
			$("#modalLeft").animate({
				left: 0
			}, {
				duration: 200,
				queue: false
			});
			$("#modalRight").animate({
				right: 0
			}, {
				duration: 200,
				queue: false
			});
		}
	}

	function autoStartHeight(i) {
		//Height
		currentHeight = $("#slide-" + i + "").height();
		if (showNavButtons == "True") {
			currentHeight = currentHeight + 35; //make room for the control buttons.
		}
		$(".jasonSlider").css("height", currentHeight);
	}

	function autoStartWidth(i) {
		//Width
		currentWidth = $("#slide-" + i + "").width();
		$(".jasonSlider").css("width", currentWidth);
	}
	//parse Height param and set initial Height
	if (sliderHeight == "auto") {
		autoStartHeight(0);
	} else {
		currentHeight = parseInt(sliderHeight)
		if (showNavButtons == "True") {
			currentHeight = currentHeight + 35; //make room for the control buttons.
		}
		$(".jasonSlider").css("height", currentHeight);
	}
	//parse Width param and set initial Width
	if (sliderWidth == "auto") {
		autoStartWidth(0);
	} else {
		currentWidth = parseInt(sliderWidth)
		$(".jasonSlider").css("width", currentWidth);
	}
	//If nav arrows are turned on, build them
	if (showNavArrows == "True") {
		//add and style arrow controls
		$(".jasonSlider").append("<div class='navModal animated' id='modalLeft'></div>");
		$(".jasonSlider").append("<div class='navModal animated' id='modalRight'></div>");
		if (showNavButtons == "True") {
			$("#modalLeft, #modalRight").css("height", currentHeight - 35);
		} else {
			$("#modalLeft, #modalRight").css("height", currentHeight);
		}
	}
	//set initial slide states
	$(".contentSlide").first().addClass("visibleSlide");
	$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
	index = 0; //set starting index
	/**********************************
	Info button behavior
	**********************************/
	toggleState = 0;
	$(document).on('click', '.js-info', function(e) {
		if (toggleState == 0) {
			$(".js-caption").removeClass("fadeOutDown").addClass("fadeInUp");
			toggleState = 1;
		} else {
			$(".js-caption").removeClass("fadeInUp").addClass("fadeOutDown");
			toggleState = 0;
		}
		e.preventDefault();
	});
	/**********************************
	Nav arrow hover behavior
	**********************************/
	$(".navModal").hover(function() {
		$(this).removeClass("fadeOut").addClass("fadeIn");
	}, function() {
		if ($(".visibleSlide").children().is("iframe")) {
			//do nothing
		} else {
			$(this).removeClass("fadeIn").addClass("fadeOut");
		}
	});
	/**********************************
	Arrow button behavior
	**********************************/
	$(".navModal").click(function() {
		//Clean out animation classes for next cycle
		$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
		$(".contentSlide").removeClass("slideInRight").removeClass("slideOutRight").removeClass("slideInLeft").removeClass("slideOutLeft").removeClass("fadeOut").removeClass("fadeIn");
		var id = this.id;
		if (id == "modalRight") {
			$(".visibleSlide").addClass("Shift");
			if (index < maxindex - 1) {
				//Animate Left
				$(".Shift").addClass("slideOutLeft");
				$(".Shift").next().removeClass("hideSlide").addClass("slideInRight");
				$(".Shift").next().addClass("visibleSlide");
				if ($(".Shift").next().children().is("iframe")) {
					$(".navModal").removeClass("fadeOut").addClass("fadeIn");
				} else {
					$(".navModal").removeClass("fadeIn").addClass("fadeOut"); //fade out arrow after iframe
				}
				index = index + 1;
			} else {
				//Animate Left
				$(".Shift").addClass("slideOutLeft");
				$(".contentSlide").first().addClass("slideInRight");
				$(".contentSlide").first().addClass("visibleSlide").removeClass("hideSlide");
				if ($(".contentSlide").first().children().is("iframe")) {
					$(".navModal").removeClass("fadeOut").addClass("fadeIn");
				} else {
					$(".navModal").removeClass("fadeIn").addClass("fadeOut"); //fade out arrow after iframe
				}
				index = 0;
			}
			$(".Shift").removeClass("visibleSlide").removeClass("Shift");
			//Set info button state
			showInfoButton();
			//Change slider size if Auto sizing is on
			if (sliderHeight == "auto") {
				autoSetHeight(index);
			}
			if (sliderWidth == "auto") {
				autoSetWidth(index);
			}
		} else if (id == "modalLeft") {
			$(".visibleSlide").addClass("Shift");
			if (index != 0) {
				//Animate Right
				$(".Shift").addClass("slideOutRight");
				$(".Shift").prev().removeClass("hideSlide").addClass("slideInLeft");
				$(".Shift").prev().addClass("visibleSlide");
				if ($(".Shift").prev().children().is("iframe")) {
					$(".navModal").removeClass("fadeOut").addClass("fadeIn");
				} else {
					$(".navModal").removeClass("fadeIn").addClass("fadeOut"); //fade out arrow after iframe
				}
				index = index - 1;
			} else {
				//Animate Right
				$(".Shift").addClass("slideOutRight");
				$(".contentSlide").last().addClass("slideInLeft");
				$(".contentSlide").last().addClass("visibleSlide").removeClass("hideSlide");
				if ($(".contentSlide").last().children().is("iframe")) {
					$(".navModal").removeClass("fadeOut").addClass("fadeIn");
				} else {
					$(".navModal").removeClass("fadeIn").addClass("fadeOut"); //fade out arrow after iframe
				}
				index = maxindex - 1;
			}
			$(".Shift").removeClass("visibleSlide").removeClass("Shift");
			//Set info button state
			showInfoButton();
			//Change slider size if Auto sizing is on
			if (sliderHeight == "auto") {
				autoSetHeight(index);
			}
			if (sliderWidth == "auto") {
				autoSetWidth(index);
			}
		}
		//switch the control button image
		$('.slideSelectBTN').css("background", "url('./images/select-button-OFF.png')");
		$("#control-" + (index) + "").css("background", "url('./images/select-button-ON.png')");
	});
	/**********************************
	control button behavior
	**********************************/
	$(".slideSelectBTN").click(function() {
		//reset all button images
		$('.slideSelectBTN').css("background", "url('./images/select-button-OFF.png')");
		//change the clicked button image to the ON state
		$(this).css("background", "url('./images/select-button-ON.png')");
		//Clean out animation classes for next cycle
		$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
		$(".contentSlide").removeClass("slideInRight").removeClass("slideOutRight").removeClass("slideInLeft").removeClass("slideOutLeft").removeClass("fadeOut").removeClass("fadeIn");
		//Get the ID of the dynamically created button that was clicked
		var a = $(this).attr("id");
		//Parse out the number in the ID
		var destinationIndex = a.match(/\d+/);
		if (destinationIndex != index) {
			//Animate
			$(".visibleSlide").addClass("Shift");
			$(".Shift").addClass("fadeOut");
			$("#slide-" + destinationIndex + "").addClass("fadeIn").addClass("visibleSlide").removeClass("hideSlide");
			if ($("#slide-" + destinationIndex + "").children().is("iframe")) {
				$(".navModal").removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".navModal").removeClass("fadeIn").addClass("fadeOut");
			}
			$(".Shift").removeClass("visibleSlide").removeClass("Shift");
		}
		index = parseInt(destinationIndex);
		//Set info button state
		showInfoButton();
		//Change slider size if Auto sizing is on
		if (sliderHeight == "auto") {
			autoSetHeight(index);
		}
		if (sliderWidth == "auto") {
			autoSetWidth(index);
		}
	});
	/**********************************
	auto-advance behavior
	**********************************/
	var delayTimer = slideDelay;
	if (autoAdvanceTrigger == "True") {
		setInterval(function() {
			$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
			$(".contentSlide").removeClass("slideInRight").removeClass("slideOutRight").removeClass("slideInLeft").removeClass("slideOutLeft").removeClass("fadeOut").removeClass("fadeIn");
			$(".visibleSlide").addClass("Shift");
			if (index < maxindex - 1) {
				//Animate Left
				$(".Shift").addClass("slideOutLeft");
				$(".Shift").next().removeClass("hideSlide").addClass("slideInRight");
				$(".Shift").next().addClass("visibleSlide");
				index = index + 1;
			} else {
				//Animate Left
				$(".Shift").addClass("slideOutLeft");
				$(".contentSlide").first().addClass("slideInRight");
				$(".contentSlide").first().addClass("visibleSlide").removeClass("hideSlide");
				index = 0;
			}
			$(".Shift").removeClass("visibleSlide").removeClass("Shift");
			//switch the control button image
			$('.slideSelectBTN').css("background", "url('./images/select-button-OFF.png')");
			$("#control-" + (index) + "").css("background", "url('./images/select-button-ON.png')");
			//Set info button state
			showInfoButton();
			//Change slider size if Auto sizing is on
			if (sliderHeight == "auto") {
				autoSetHeight(index);
			}
			if (sliderWidth == "auto") {
				autoSetWidth(index);
			}
		}, delayTimer);
	}
	/**********************************
	swipe behavior for mobile
	**********************************/
	//Left
	$(".contentSlide").on("swipeleft", function() {
		//Clean out animation classes for next cycle
		$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
		$(".contentSlide").removeClass("slideInRight").removeClass("slideOutRight").removeClass("slideInLeft").removeClass("slideOutLeft").removeClass("fadeOut").removeClass("fadeIn");
		$(".visibleSlide").addClass("Shift");
		if (index < maxindex - 1) {
			//Animate Left
			$(".Shift").addClass("slideOutLeft");
			$(".Shift").next().removeClass("hideSlide").addClass("slideInRight");
			if ($(".Shift").next().children().is("iframe")) {
				$(".navModal").removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".navModal").removeClass("fadeIn").addClass("fadeOut");
			}
			$(".Shift").next().addClass("visibleSlide");
			index = index + 1;
		} else {
			//Animate Left
			$(".Shift").addClass("slideOutLeft");
			$(".contentSlide").first().addClass("slideInRight");
			$(".contentSlide").first().addClass("visibleSlide").removeClass("hideSlide");
			if ($(".contentSlide").first().children().is("iframe")) {
				$(".navModal").removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".navModal").removeClass("fadeIn").addClass("fadeOut");
			}
			index = 0;
		}
		$(".Shift").removeClass("visibleSlide").removeClass("Shift");
		//Set info button state
		showInfoButton();
		//Change slider size if Auto sizing is on
		if (sliderHeight == "auto") {
			autoSetHeight(index);
		}
		if (sliderWidth == "auto") {
			autoSetWidth(index);
		}
		//switch the control button image
		$('.slideSelectBTN').css("background", "url('./images/select-button-OFF.png')");
		$("#control-" + (index) + "").css("background", "url('./images/select-button-ON.png')");
	});
	//Right
	$(".contentSlide").on("swiperight", function() {
		//Clean out animation classes for next cycle
		$(".contentSlide").not(".visibleSlide").addClass("hideSlide");
		$(".contentSlide").removeClass("slideInRight").removeClass("slideOutRight").removeClass("slideInLeft").removeClass("slideOutLeft").removeClass("fadeOut").removeClass("fadeIn");
		$(".visibleSlide").addClass("Shift");
		if (index != 0) {
			//Animate Right
			$(".Shift").addClass("slideOutRight");
			$(".Shift").prev().removeClass("hideSlide").addClass("slideInLeft");
			if ($(".Shift").prev().children().is("iframe")) {
				$(".navModal").removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".navModal").removeClass("fadeIn").addClass("fadeOut");
			}
			$(".Shift").prev().addClass("visibleSlide");
			index = index - 1;
		} else {
			//Animate Right
			$(".Shift").addClass("slideOutRight");
			$(".contentSlide").last().addClass("slideInLeft");
			$(".contentSlide").last().addClass("visibleSlide").removeClass("hideSlide");
			if ($(".contentSlide").last().children().is("iframe")) {
				$(".navModal").removeClass("fadeOut").addClass("fadeIn");
			} else {
				$(".navModal").removeClass("fadeIn").addClass("fadeOut");
			}
			index = maxindex - 1;
		}
		$(".Shift").removeClass("visibleSlide").removeClass("Shift");
		//Set info button state
		showInfoButton();
		//Change slider size if Auto sizing is on
		if (sliderHeight == "auto") {
			autoSetHeight(index);
		}
		if (sliderWidth == "auto") {
			autoSetWidth(index);
		}
		//switch the control button image
		$('.slideSelectBTN').css("background", "url('./images/select-button-OFF.png')");
		$("#control-" + (index) + "").css("background", "url('./images/select-button-ON.png')");
	});
} //end function