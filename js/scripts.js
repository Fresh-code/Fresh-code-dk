/**
 * @depends jquery-2.2.1.min.js
 * @depends bootstrap.min.js
 * @depends libraries/lodash.js
 * @depends libraries/parsley.min.js
 * @depends libraries/prism.js
 */
(function(global) {

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

        function closeForm() {
            $('.hamburger').removeClass('close-nav');
            $('body').removeClass('menu-opened');
            $('body').removeClass('form-opened');
            $('.icon-sign').removeClass('hidden');
            setTimeout(function() {
                $('body').removeClass('locked');
            }, 150);
            byMailBtn = false;
        }

        var $form = $('form.hire-us-form'),
            $name = $form.find("input[name='name']"),
            $email = $form.find("input[name='email']"),
            $subject = $form.find("input[name='subject']"),
            $message = $form.find("input[name='message']");

        $form.parsley();
        $form.submit(function (e) {
            e.preventDefault();

            $.ajax({
                method: "POST",
                url: "https://getform.org/f/2470bd55-f6d2-4752-820e-ec23eccd8202",
                data: {
                    name: $name.val(),
                    email: $email.val(),
                    subject: $subject.val(),
                    message: $message.val()
                },
                crossDomain: true
            });

            $form[0].reset();
            $('.form-header').css('display', 'none');
            $('.hire-us-form').css('display', 'none');
            $('.form-thx').css('display', 'block');

            setTimeout(function () {
                closeForm();
            }, 3000);
        });

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

        if ($(window).width() > 1000) {
            $('.parallax-text').css({
                "transform" : "translate3d(0px, " + st/4 + "px, 0px)"
            });
            $('.parallax-section').css({
                "transform" : "translate3d(0px, " + st/5 + "px, 0px)"
            });
        }

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
})(this);

