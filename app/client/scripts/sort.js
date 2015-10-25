;(function($, undefined) {

  var sortChildren = function(element, attr) {
    var elements = [];
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.getAttribute) {
        elements.push(node);
      }
    }
    elements.sort(function(a, b) {
      return parseInt(a.getAttribute(attr)) - parseInt(b.getAttribute(attr));
    });

    $(element).empty().append(elements);
  };

  $(function() {

    $('.trials-sorting [data-sort-trials]').on('click', function() {
      var self = $(this);
      var attr = self.attr('data-sort-trials');
      sortChildren($('#trials-list').get(0), attr);
      $(this).parents('.trials-sorting').removeClass('is-opened')
        .find('.current').text(self.text());

      self.parent().prepend(self);
    });

    $('.trials-sorting .current').on('click', function() {
      $(this).parents('.trials-sorting').addClass('is-opened');
    });

    $('body').on('click', function(event) {
      if ($(event.target).parents('.trials-sorting').length == 0) {
        $('.trials-sorting').removeClass('is-opened');
      }
    });

  });

})(jQuery);
