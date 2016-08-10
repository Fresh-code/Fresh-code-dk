$(window).on("load", function() {
    var byMenuBtn = false,
        byMailBtn = false,
        closeMailForm = false;

    $('#hire').on('click', function(e) {
        e.preventDefault();

       $('.icon-sign').trigger('click');
    });

    $('.hamburger').on('click', function(e) {
        if (!byMailBtn) {
            if (byMenuBtn) {
                $('.hamburger').removeClass('close-nav');
                setTimeout(function() {
                    $('body').removeClass('menu-opened');
                    $('body').removeClass('form-opened');
                        $('.icon-sign').removeClass('hidden');
                    $('body').removeClass('locked');
                }, 150);
                byMenuBtn = false;
            } else {
                $('.hamburger').addClass('close-nav');
                setTimeout(function() {
                    $('body').addClass('menu-opened');
                }, 150);
                $('.icon-sign').addClass('hidden');
                $('body').addClass('locked');
                byMenuBtn = true;
            }
        } else {
            closeMailForm = false;
            byMailBtn = false;
            $('.hamburger').removeClass('close-nav');
            $('.icon-sign').removeClass('hidden');
            setTimeout(function() {
                $('body').removeClass('locked');
            }, 150);
            $('body').removeClass('form-opened');
        }
    }); // Click on menu icon

    $('.icon-sign').on('click', function() {
        if(!byMailBtn) {
            byMailBtn = true;
            setTimeout(function() {
                $('body').addClass('form-opened');
            }, 150);
            $('.hamburger').addClass('close-nav');
            $(this).addClass('hidden');
            $('body').addClass('locked');
        }
    });// mail-popup-block

    menuOnScroll();
}); //$(window).on("load", function()...

var lastScrollTop = 0;
var count = 0;
$(window).scroll(function() {
    menuOnScroll();
});

function menuOnScroll() {
    var header = $('.fresh-header');
    var st = $(this).scrollTop();
    if (st < 1) {
        header.removeClass('is-scrolled');
        header.removeClass('scrolled-by');
    }
    else if (st >= lastScrollTop) { header.addClass('is-scrolled'); }
    else {
        header.addClass('scrolled-by');
        header.removeClass('is-scrolled');
    }
    lastScrollTop = st;
}
