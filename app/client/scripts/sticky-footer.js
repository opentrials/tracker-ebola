;(function($, undefined) {

  var content = $('.cd-main-content');

  $(function() {
    var updateFooter = function() {
      if (content.length == 0) {
        return;
      }
      var contentHeight = content.get(0).scrollHeight;
      var outerHeight = $('body').height() - $('.site-header').height();

      if (contentHeight < outerHeight) {
        var shadowFooter = content.find('.site-footer.fixed-footer');
        if (shadowFooter.length == 0) {
          var footer = content.find('.site-footer');
          shadowFooter = footer.clone().addClass('fixed-footer');
          footer.addClass('fixed-placeholder').after(shadowFooter);
        }
      } else {
        var shadowFooter = content.find('.site-footer.fixed-footer');
        if (shadowFooter.length) {
          shadowFooter.remove();
          content.find('.site-footer.fixed-placeholder')
            .removeClass('fixed-placeholder');
        }
      }
    };

    $(window).on('resize', updateFooter);
    updateFooter();

  });

})(jQuery);
