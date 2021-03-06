//requires jQuery


var cardSelectApp = (function () {
    "use strict";
	
	if(typeof jQuery !== "undefined"){
		var $ = jQuery;
	}
	
	if(typeof $ === "undefined"){
		throw "jQuery required for the card picker game"
	}
    
    var frameCount;
    var my = {};
    
    my.initialState = $("#cardSelectApp").html();
    
    //this init function will be called at the end of this inline body function
    my.init = function () {
		
		$(window).resize(my.repositionGutter);
        
        if(   getQueryParamByName("backlink") === "true" 
           || getQueryParamByName("backlink") === "y"
		   || getQueryParamByName("backlink") === "button"){
            $("#cardSelectApp").addClass("backLinkActive");
            var backlinkURL = my.resolveBacklinkURL(getQueryParamByName("backlinkURL"));
			
			
			
			if(backlinkURL !== null){
				$("#back-link").attr("href",backlinkURL);
			} else {
				//debugger;
				$("#back-link").click(my.navBack);
			}
			
			if(getQueryParamByName("backlink") === "button"){
				$("#back-link").addClass("buttonStyle");
			} else {
				$("#back-link").addClass("linkStyle");
			}
				
        }
        
        //console.log("hello world");
        frameCount = 1;

        var selectionCount = 0;
        $(".phase1").show();
        $(".phase2").hide();

        $(".card").each(function () {

            $(this).on("click", function () {
                var clickedCard = $(this);

                selectionCount = selectionCount + 1;
                $(this).find("img")
                    .wrap("<div class='selectedCard' id='selected_" + selectionCount + "'></div>");

                var selectedCard = $(this).find(".selectedCard");
                var startingPosition = selectedCard.offset();

                console.log(startingPosition);

                startingPosition.top = startingPosition.top - $(document).scrollTop();
                startingPosition.left = startingPosition.left - $(document).scrollLeft();

                selectedCard.css("top", startingPosition.top)
                selectedCard.css("left", startingPosition.left);
                selectedCard.addClass("animated");

                if (detectIE() === false || detectIE() > 11) {
                    //animated version
                    if (selectionCount === 1) {

                        selectedCard.animate({
                            top: "90vh",
                            left: my.getGutterOffset(selectedCard, 0)
                        }, {
                            complete: function () {
                                my.addCardFlipFaces(selectedCard);

                            }
                        });
                    } else if (selectionCount === 2) {
                        my.flipCard(1);
                        selectedCard.animate({
                            top: "90vh",
                            left: my.getGutterOffset(selectedCard, 1)
                        }, {
                            complete: function () {
                                my.addCardFlipFaces(selectedCard);

                            }
                        });
                    } else if (selectionCount === 3) {
                        my.flipCard(2);
                        selectedCard.animate({
                            top: "90vh",
                            left: my.getGutterOffset(selectedCard, 2)
                        }, {
                            complete: function () {
                                my.addCardFlipFaces(selectedCard);
                            }
                        });

                        my.phase2();
                    }

                } else {
                    //simple IE version
                    if (selectionCount === 1) {

                        selectedCard.css({
                            bottom: "-150px",
                            top: "",
                            left: (my.getGutterOffset(selectedCard) - 400)
                        });
                        my.addCardFlipFaces(selectedCard);
                    } else if (selectionCount === 2) {
                        my.flipCard(1);
                        selectedCard.css({
                            bottom: "-150px",
                            top: "",
                            left: my.getGutterOffset(selectedCard)
                        });

                        my.addCardFlipFaces(selectedCard);

                    } else if (selectionCount === 3) {
                        my.flipCard(2);
                        selectedCard.css({
                            bottom: "-150px",
                            top: "",
                            left: (my.getGutterOffset(selectedCard) + 400)
                        });

                        my.addCardFlipFaces(selectedCard);

                        my.phase2();
                    }
                }

            })
        });
    };

    my.addCardFlipFaces = function (element) {
        element.find("img")
            .wrap("<div class='cardFront'></div>");

        element.find(".cardFront")
            .after("<div class='cardBack'></div>");
    }
	
	my.resolveBacklinkURL = function(sourceURL){
		//debugger;
		if(sourceURL === null){
			return null;
		} else{
			try{
				return new URL(sourceURL).href;
			} catch(e) {
				if(sourceURL.substr(0,2) === '//'){
						return new URL(window.location.protocol + sourceURL).href;
					}
				else if(sourceURL.search(".") === -1){
					return sourceURL;
				} else if(sourceURL.substr(0,4) !== 'http') { 
					return new URL(window.location.protocol + '//' + sourceURL).href;
				} else {
					return sourceURL;
				}
			}
		}
		
	}

    my.repositionGutter = debounce(function () {
        console.log("called");
        var card1 = $(".phase1 #selected_1");
        var card2 = $(".phase1 #selected_2");
        var card3 = $(".phase1 #selected_3");
        
        console.log(card1);
        console.log(card2);
        console.log(card3);
		

		card1.css('left', my.getGutterOffset(card1,0));
		card2.css('left', my.getGutterOffset(card2,1));
		card3.css('left', my.getGutterOffset(card3,2))
    }, 250);

    my.getGutterOffset = function (residentCard, position) {
        var baseOffset = ($(document).width() / 2) - (residentCard.width() / 2);
		var scalar = 0;
		var positionOffset = 0;
		
		if(position === 0){
			scalar = -1;
		} else if (position === 2){
			scalar = 1;
		}
		
		if($(document).width() > 1050){
			positionOffset = 400;
		} else if($(document).width() > 750) {
			positionOffset = 250;
		} else{
			positionOffset = 180;
		}
		
		return baseOffset + (positionOffset * scalar);
    }


    //console.log(document.innerHTML);

    my.phase2 = function () {



        $(".card").off();
        $("div.phase1").delay(1000).fadeOut(400, function () {

            $(".descriptionText").hide();
            $("#text1").show();

            $("div.phase2").fadeIn();
            
            my.flipCard(3);


            $(".phase1 .selectedCard")
                .hide()
                .addClass("card")
                .attr("style", "");
            
            var card1 = $(".phase1 #selected_1");
            var card2 = $(".phase1 #selected_2");
            var card3 = $(".phase1 #selected_3");
            
            $(".selectedCard").hide();
            
            card1.appendTo("div.phase2 .cardContainer");
            card1.slideDown(500);
            
            card2.insertAfter(card1); 
            card2.slideDown(500);
            
            card3.insertAfter(card2);
            card3.slideDown(500); 
                

            /*$(".selectedCard")
                .wrap("<div class='flipContainer flipped'></div>")
                .wrap("<div class='flipper'></div>");*/



            $("div.selectedCard").on('click', my.clickNextCard);
            $("div.selectedCard:nth-child(1) .cardBack").after("<p>Past</p>");
            $("div.selectedCard:nth-child(2) .cardBack").after("<p>Present</p>");
            $("div.selectedCard:nth-child(3) .cardBack").after("<p>Future</p>");
            $("div.selectedCard:nth-child(1)").toggleClass('nextClickable');


        });

    };

    my.next = function () {
        if (frameCount === undefined) {
            frameCount = 0;
        }

        if (frameCount === 1) {
            my.flipCard(1);
            $("div.selectedCard:nth-child(1)").toggleClass('nextClickable');
            $("div.selectedCard:nth-child(2)").toggleClass('nextClickable');
        } else if (frameCount === 2) {

            my.flipCard(1);
            my.flipCard(2);
            $("div.selectedCard:nth-child(2)").toggleClass('nextClickable');
            $("div.selectedCard:nth-child(3)").toggleClass('nextClickable');
        } else if (frameCount === 3) {
            my.flipCard(2);
            my.flipCard(3);
			$("#nextButton").text("Show All")
        /*} else if (frameCount === 4) {
            $("div.selectedCard:nth-child(3)").toggleClass('nextClickable')
            my.flipCard(3);
            $("#nextButton").text("Show All");*/
            $("#nextButton").text("Show All");
        } else if (frameCount === 4) {
			$("div.selectedCard:nth-child(3)").toggleClass('nextClickable')
            my.flipCard(1);
            my.flipCard(2);
            //my.flipCard(3);
            $("a#nextButton").hide();
        }

        if (frameCount < 6) {
            var prevText = $("#text" + (frameCount - 1));
            var newText = $("#text" + frameCount);
            
            prevText.css("height",0);
            
            if(prevText.length){
                prevText.fadeOut(function(){
                    newText.fadeIn();
                });
            } else{
                newText.fadeIn();
            }
            
            

            frameCount++;
        }



    }

    my.clickNextCard = function () {
        var $this = $(this);
        if ($this.hasClass('nextClickable')) {
            my.next();
        }
    }

    my.flipCard = function (flipNum) { 
        $("#selected_" + flipNum).toggleClass("flipped");
    }

    my.reset = function () {
        var appContainer = $("#cardSelectApp");
        appContainer.fadeOut(100);
        
        //due to DOM syncronisation weirdness pause between each step
        window.setTimeout(function () {
            appContainer.html("");
            window.setTimeout(function () {
                appContainer.html(my.initialState);

                window.setTimeout(function () {
                    my.init();
                    appContainer.fadeIn();
                }, 300);
            }, 300);
        }, 200);
        
        

    }

    my.navBack = function () {
		//debugger;
		window.history.back();
    }


    return my;

    //debounce function copied from https://davidwalsh.name/javascript-debounce-function @ 2018-03-24
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };


    };

    //detectIE() copied from https://codepen.io/gapcode/pen/vEJNZN by Mario @ 2018-03-24
    function detectIE() {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

    //copied from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript @ 2018-03-24
    function getQueryParamByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
	
	

}());

$(window).on("load", cardSelectApp.init());


