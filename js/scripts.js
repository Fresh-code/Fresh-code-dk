/**
 * @depends libraries/jquery-2.2.1.min.js
 * @depends libraries/bootstrap.min.js
 * @depends libraries/lodash.js
 * @depends libraries/parsley.min.js
 * @depends libraries/prism.min.js
 */
(function(global) {
    
    $(window).on("load", function() {
        var byMenuBtn = false,
            byMailBtn = false,
            byThx = false,
            closeMailForm = false;

        $('#hire').on('click', function(e) {
            e.preventDefault();

            byMailBtn = true;
            $('.icon-sign').trigger('click');
        });

        $('.hamburger').on('click', function(e) {
            if (!byMailBtn) {
                if (byMenuBtn) {
                        $('.hamburger').removeClass('close-nav');
                        $('.icon-sign').removeClass('hidden');
                        setTimeout(function() {
                            $('body').removeClass('menu-opened');
                            $('body').removeClass('form-opened');
                            $('body').removeClass('locked');
                        }, 150);
                        byMenuBtn = false;
                } else {
                    if(byThx) thxClose(true);

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
                if(byThx) thxClose(false);

                $('.hamburger').removeClass('close-nav');
                $('.icon-sign').removeClass('hidden');
                setTimeout(function() {
                    $('body').removeClass('locked');
                }, 150);
                $('body')
                    .removeClass('form-opened')
                    .removeClass('thx-opened');
            }
        }); // Click on menu icon

        $('.icon-sign').on('click', function() {
            if(!byMailBtn) {

                if(byThx) thxClose(false);

                byMailBtn = true;
                setTimeout(function() {
                    $('body').addClass('form-opened');
                }, 150);
                $('.hamburger').addClass('close-nav');
                $(this).addClass('hidden');
                $('body').addClass('locked');
            } else {
                byMailBtn = false;
                thxClose(false);
            }
        });// mail-popup-block

        function thxClose(flag) {
            byThx = false;

            $('body')
                .removeClass('thx-opened')
                .removeClass( flag ? 'form-opened' : 'menu-opened');

            $('#one').css('display', 'flex');
            $('#two').css('display', 'none');

            $('.hamburger').addClass('close-nav');
            $('.icon-sign').addClass('hidden');
        }

        function thx() {
            byThx = true;
            $('body').addClass('thx-opened');
            $('body').removeClass('menu-opened');

            $('#one').css('display', 'none');
            $('#two').css('display', 'flex');

            $('.hamburger').removeClass('close-nav');
            byMailBtn = false;

            resetForm();
        }

        function resetForm() { $form[0].reset(); }

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
                url: "https://getform.org/f/07683c3f-c72c-47bc-98d7-2f0e866fab3f",
                data: {
                    name: $name.val(),
                    email: $email.val(),
                    subject: $subject.val(),
                    message: $message.val()
                },
                crossDomain: true
            });

            thx();
            $form[0].reset();
        });

        menuOnScroll();
    }); //$(window).on("load", function()...



    var lastScrollTop = 0;
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

