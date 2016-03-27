/* Thanks: http://www.hongkiat.com/blog/css-sticky-position/ */
$(document).ready(function() {
    var stickyHeaderTop = $('.header').offset().top;

    var stickyHeader = function(){
    var scrollTop = $(window).scrollTop();
         
    if (scrollTop > stickyHeaderTop) { 
        $('.header').addClass('sticky');
    } else {
        $('.header').removeClass('sticky'); 
    }
    };

    stickyHeader();

    $(window).scroll(function() {
        stickyHeader();
    });
});
