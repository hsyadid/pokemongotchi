
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    // SCROLL TO TOP FUNCTIONALITY
    $(window).scroll(function() {
      if ($(this).scrollTop() > 300) {
        $('#scrollToTopBtn').addClass('visible');
      } else {
        $('#scrollToTopBtn').removeClass('visible');
      }
    });

  })(window.jQuery);

// SCROLL TO TOP FUNCTION
function scrollToTop() {
  $('html, body').animate({
    scrollTop: 0
  }, 600);
}


