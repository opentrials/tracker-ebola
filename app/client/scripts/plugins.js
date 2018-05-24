;(function($, undefined) {
  // scroll to anchors
  $(function() {
    smoothScroll.init({
      updateURL: false
    });
  });

  // mobile menu
  $(function() {
    var $menu = $('nav#menu');
    var $html = $('html, body');
    var closer = null;

    $menu.mmenu({
      extensions: ['pageshadow'], offCanvas: {
        position: 'right', zposition: 'front'
      }
    });

    $menu.find('a').on('click', function() {
      closer = $(this).attr('href');
    });
  });

})(jQuery);
