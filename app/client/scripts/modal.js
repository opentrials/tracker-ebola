;(function($, undefined) {

  var closeMenu = function() {
    var $lateral_menu_trigger = $('#cd-menu-trigger');
    var $content_wrapper = $('.cd-main-content');
    var $navigation = $('header');

    $lateral_menu_trigger.removeClass('is-clicked');
    $navigation.removeClass('lateral-menu-is-open');
    $content_wrapper.removeClass('lateral-menu-is-open');
    $('#cd-lateral-nav').removeClass('lateral-menu-is-open');
    $('body').removeClass('overflow-hidden');
  };

  $('body')
    .on('change', '[data-modal="open"]', function() {
      closeMenu();
      if ($(this).is(':checked')) {
        $('body').addClass('modal-open');
      } else {
        $('body').removeClass('modal-open');
        $('.modal').find('video, audio').each(function() {
          this.pause();
        });
      }
    })
    .on('click', '[data-modal="close"]', function() {
      closeMenu();
      $('.modal-state:checked').prop('checked', false).change();
    })
    .on('click', '[data-modal="disable-click"]', function(event) {
      event.stopPropagation();
    });

})(jQuery);