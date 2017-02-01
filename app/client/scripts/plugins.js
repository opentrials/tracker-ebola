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

  // cookie bar
  window.cookieconsent_options = {
    message: 'This site uses cookies. For more information, see our ',
    dismiss: 'OK, Got it',
    learnMore: 'Cookie policy.',
    link: 'https://okfn.org/cookie-policy/'
  };
})(jQuery);
