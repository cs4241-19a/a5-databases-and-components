/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/

jQuery(document).ready(function ($) {

    /*----------------------------------------------------*/
    /* FitText Settings
    ------------------------------------------------------ */

    // setTimeout(function () {
    //     $('h1.responsive-headline').fitText(1, {minFontSize: '40px', maxFontSize: '90px'});
    // }, 100);


    /*----------------------------------------------------*/
    /* Smooth Scrolling
    ------------------------------------------------------ */

    $('a.smoothscroll[href*="#"]:not([href="#"])').click(function (e) {
        e.preventDefault();

        var target = this.hash,
            $target = $(target);


        $("#nav-wrap a").parent().removeClass("current");
        $(this).parent().   addClass("current");


        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 30
        }, 800, 'swing');
    });

    $(window).on('scroll', function() {

        var h = $('header').height();
        var y = $(window).scrollTop();
        var nav = $('#nav-wrap');

        if ( (y > h*.20) && (y < h) && ($(window).outerWidth() > 768 ) ) {
            nav.fadeOut('fast');
        }
        else {
            if (y < h*.20) {
                nav.removeClass('opaque').fadeIn('fast');
            }
            else {
                nav.addClass('opaque').fadeIn('fast');
            }
        }

    });


});








