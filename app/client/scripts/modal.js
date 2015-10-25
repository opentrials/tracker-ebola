;(function($, undefined) {

  $('body')
    .on('change', '[data-modal="open"]', function() {
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
      $('.modal-state:checked').prop('checked', false).change();
    })
    .on('click', '[data-modal="disable-click"]', function(event) {
      event.stopPropagation();
    });

})(jQuery);
