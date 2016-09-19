/**
 * @depends libraries/list.min.js
 */
(function(global) {
    var $conferences = $('.filter-conferences'),
        $development = $('.filter-development'),
        $management = $('.filter-management'),
        $business = $('.filter-business'),
        $front = $('.filter-front'),
        $all = $('.filter-all'),
        $current = $all,
        $menu = false,
        $dd = $('#filter-dropdown');
    var posts = [
        
        {
            posttitle: '10 BEST PRACTICES FOR MOBILE UX DESIGN',
            platformtag: 'Ux',
            avatar: 'blog-post/author.png',
            catauthor: 'Business | Richard Guay',
            position: 'Project manager',
            postcover: '/img/blog-post/post_7c-350.jpg',
            postsrcset: '/img/blog-post/post_7c-700.jpg 700w, /img/blog-post/post_7c-450.jpg 450w, /img/blog-post/post_7c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #765145 !important',
            postbckg: 'background-color: #765145 !important',
            type: 'business',
            posturl: '/blog/2016/06/29/post-7/'
        },
        
        {
            posttitle: 'The Hourly Model of Hiring Resources. All That You Need...',
            platformtag: 'Apple',
            avatar: 'blog-post/author.png',
            catauthor: 'Business | Richard Guay',
            position: 'Project manager',
            postcover: '/img/blog-post/post_6c-350.jpg',
            postsrcset: '/img/blog-post/post_6c-700.jpg 700w, /img/blog-post/post_6c-450.jpg 450w, /img/blog-post/post_6c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #836551 !important',
            postbckg: 'background-color: #836551 !important',
            type: 'front',
            posturl: '/blog/2016/06/29/post-6/'
        },
        
        {
            posttitle: 'Tips For Building Brand Trust With UX Design',
            platformtag: 'Design',
            avatar: 'blog-post/author.png',
            catauthor: 'Management | Ivan Levin',
            position: 'Project manager',
            postcover: '/img/blog-post/post_5c-350.jpg',
            postsrcset: '/img/blog-post/post_5c-700.jpg 700w, /img/blog-post/post_5c-450.jpg 450w, /img/blog-post/post_5c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #3d7c84 !important',
            postbckg: 'background-color: #3d7c84 !important',
            type: 'front',
            posturl: '/blog/2016/06/29/post-5/'
        },
        
        {
            posttitle: 'What Is the Best Platform For the First Launch - iOS or Android?',
            platformtag: 'Android',
            avatar: 'blog-post/author.png',
            catauthor: 'Development | Boris Okolov',
            position: 'Project manager',
            postcover: '/img/blog-post/post_4c-350.jpg',
            postsrcset: '/img/blog-post/post_4c-700.jpg 700w, /img/blog-post/post_4c-450.jpg 450w, /img/blog-post/post_4c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #3d5a80 !important',
            postbckg: 'background-color: #3d5a80 !important',
            type: 'development',
            posturl: '/blog/2016/06/29/post-4/'
        },
        
        {
            posttitle: 'Shawn James & The Shapeshifters – John The Revelator (Son House)',
            platformtag: 'Apple',
            avatar: 'blog-post/author.png',
            catauthor: 'Front end | Andrey Petrov',
            position: 'Project manager',
            postcover: '/img/blog-post/post_3c-350.jpg',
            postsrcset: '/img/blog-post/post_3c-700.jpg 700w, /img/blog-post/post_3c-450.jpg 450w, /img/blog-post/post_3c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #ca6001 !important',
            postbckg: 'background-color: #ca6001 !important',
            type: 'front',
            posturl: '/blog/2016/06/27/post-3/'
        },
        
        {
            posttitle: 'Are You Aware of these Hot Mobile Commerce Trends?',
            platformtag: 'Java',
            avatar: 'blog-post/author.png',
            catauthor: 'Front end | Andrey Petrov',
            position: 'Project manager',
            postcover: '/img/blog-post/post_2c-350.jpg',
            postsrcset: '/img/blog-post/post_2c-700.jpg 700w, /img/blog-post/post_2c-450.jpg 450w, /img/blog-post/post_2c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #293448 !important',
            postbckg: 'background-color: #293448 !important',
            type: 'front',
            posturl: '/blog/2016/06/28/post-2/'
        },
        
        {
            posttitle: 'The Hourly Model of Hiring Resources: All That You Need to Know',
            platformtag: 'Apple',
            avatar: 'blog-post/author.png',
            catauthor: 'Development | Ivan Ivanov',
            position: 'Project manager',
            postcover: '/img/blog-post/post_1c-350.jpg',
            postsrcset: '/img/blog-post/post_1c-700.jpg 700w, /img/blog-post/post_1c-450.jpg 450w, /img/blog-post/post_1c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #97a8aa !important',
            postbckg: 'background-color: #97a8aa !important',
            type: 'development',
            posturl: '/blog/2016/06/27/post-1/'
        },
        
        {
            posttitle: 'Are You Aware of these Hot Mobile Commerce Trends?',
            platformtag: 'Apache',
            avatar: 'blog-post/author.png',
            catauthor: 'Front end | Andrey Petrov',
            position: 'Project manager',
            postcover: '/img/blog-post/post_9c-350.jpg',
            postsrcset: '/img/blog-post/post_9c-700.jpg 700w, /img/blog-post/post_9c-450.jpg 450w, /img/blog-post/post_9c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #56705c !important',
            postbckg: 'background-color: #56705c !important',
            type: 'front',
            posturl: '/blog/2016/06/29/post-9/'
        },
        
        {
            posttitle: 'The Do’s and Don’ts of a Successful App Launch',
            platformtag: 'Teamcity',
            avatar: 'blog-post/author.png',
            catauthor: 'Business | Richard Guay',
            position: 'Project manager',
            postcover: '/img/blog-post/post_8c-350.jpg',
            postsrcset: '/img/blog-post/post_8c-700.jpg 700w, /img/blog-post/post_8c-450.jpg 450w, /img/blog-post/post_8c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #5d5854 !important',
            postbckg: 'background-color: #5d5854 !important',
            type: 'business',
            posturl: '/blog/2016/05/02/post-8/'
        }
        
    ];

    var options = {
        valueNames: [
            'posttitle',
            'platformtag',
            'catauthor',
            'position',
            { attr: 'src', name: 'postcover' },
            { attr: 'srcset', name: 'postsrcset' },
            { attr: 'sizes', name: 'postsize' },
            { attr: 'style', name: 'postbckg' },
            { attr: 'style', name: 'postcoverbckg' },
            'type',
            { attr: 'href', name: 'posturl' }
        ],
        item: '<div class="col-xxs col-xs-6 col-sm-4 col-md-4 preview-img col-lg-4 no-padding">' +
        '<a href="" class="posturl">' +
        '<div class="description blog postcoverbckg">' +
        '<img draggable="false" class="img-responsive postcover postsrcset postsize" alt="preview image" title="preview image">' +
        '<div class="bckg-cover postbckg"></div>'+
        '<div class="cover">' +
        '<h3 class="posttitle"></h3>' +
        '<span class="date catauthor"></span>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</div>'
    };

    var hackerList = new List('hacker-list', options, posts);
    var conferences = 0,
        development = 0,
        management = 0,
        business = 0,
        front = 0,
        all = posts.length;

    var type = ['all', 'business', 'conferences', 'development', 'front', 'management'];
    var init = function () {
        hackerList.filter(function (item) {
            switch (item.values().type) {
                case 'business':
                    business++;
                    break;
                case 'conferences':
                    conferences++;
                    break;
                case 'development':
                    development++;
                    break;
                case 'front':
                    front++;
                    break;
                case 'management':
                    management++;
                    break;
            }
        });
        hackerList.filter();
        _.forEach(type, function(t) {
            switch (t) {
                case 'all':
                    all > 0
                        ? $all.siblings().html(all)
                        : $all.parent().remove();
                    break;
                case 'business':
                    business > 0
                        ? $business.siblings().html(business)
                        : $business.parent().remove();
                    break;
                case 'conferences':
                    conferences > 0
                        ? $conferences.siblings().html(conferences)
                        : $conferences.parent().remove();
                    break;
                case 'development':
                    development > 0
                        ? $development.siblings().html(development)
                        : $development.parent().remove();
                    break;
                case 'front':
                    front > 0
                        ? $front.siblings().html(front)
                        : $front.parent().remove();
                    break;
                case 'management':
                    management > 0
                        ? $management.siblings().html(management)
                        : $management.parent().remove();
                    break;
            }
        });
        window.posts = hackerList;
    };
    init();

    $('#nav li').on('click', function(e) {
        var t = $(e.target),
            $more = $("#nav li.more img.img-more");

        if(!t.attr('class')) return;
        if(!t.attr('class').indexOf('img-more')) return;
        if(!t.attr('class').indexOf('badge')) { t = $(t.siblings()); }

        if($menu) $more.trigger('click');

        var type = (t.attr('class').split(' ')[1]).split('filter-')[1];

        clear(t);
        clearDD(type);
        if(type == 'all') hackerList.filter();
        else {
            hackerList.filter(function(item) {
                return item.values().type == type;
            });
        }
    });

    var clear = function (el) {
        var target = el,
            sibling = $current.siblings();

        $current.removeClass('active');
        sibling.removeClass('active');
        $current = target;
        sibling = $current.siblings();
        $current.addClass('active');
        sibling.addClass('active');
    };

    var navigationResize = function() {

        if($(window).width() > 779) {
            $('#nav li.more').before($('#overflow > li'));

            var $navItemMore = $('#nav > li.more'),
                $navItems = $('#nav > li:not(.more)'),
                $nav = $('#nav'),
                navItemMoreWidth = navItemWidth = $navItemMore.width(),
                windowWidth = $(window).width(),
                navWidth = $nav.width(),
                navItemMoreLeft, offset, navOverflowWidth;

            _($navItems).forEach(function(value) { navItemWidth += $(value).width() + 24; } );

            windowWidth = $(window).width() - 42;
            navItemWidth > windowWidth - 42 ? $navItemMore.show() : $navItemMore.hide();

            while (navItemWidth > windowWidth - 42) {
                navItemWidth -= $navItems.last().width();
                $navItems.last().prependTo('#overflow');
                $navItems.splice(-1,1);
            }

            navOverflowWidth = $('#overflow').width();
            offset = navItemMoreWidth - navOverflowWidth;
            $('#overflow').css({
                'left': -350
            });
        }
    };

    window.onresize = navigationResize;
    navigationResize();

    $("#nav li.more img.img-more").click(function() {
        if (!$menu) {
            $menu = true;
            $(this).css("transform", "rotate(90deg)");
            $("#overflow").css("opacity", "1");
            $("#overflow").css("visibility", "visible");
        } else {
            $menu = false;
            $(this).css("transform","" );
            $("#overflow").css("opacity", "");
            $("#overflow").css("visibility", "");
        }
    });

    var clearDD = function(el) { $dd.val(el); };

    $(function() {
        var $nav = $('#nav').find('li:not(.more)');

        _.forEach($nav, function(r) {
            var t = $(r),
                c = t.find('.blog-filter').attr('class').split('filter-')[1],
                f = t.find('.blog-filter').html() + ' ',
                b = t.find('.badge.custom').html();

            if(c.indexOf(' ') > 0) c = c.split(' ')[0];
            $('#filter-dropdown').append('<option value="'+c+'">'+f+'('+b+')</option>');
        });

    });

    $dd.change(function (e) {
        var t = $(e.target);
        type = t.val();

        var nav = $('#nav li:not(.more)').find('.filter-'+type);

        clear(nav);
        if(!type.indexOf('all')) hackerList.filter();
        else {
            hackerList.filter(function(item) {
                return item.values().type == type;
            });
        }
    });
})(this);

