;(function($, undefined) {

  // scroll to achors
  $(function() {
    smoothScroll.init({
      updateURL: false
    });
  });


  // mobile menu
  $(function() {
		var $menu = $('nav#menu'),
			$html = $('html, body');

		$menu.mmenu({
			extensions 	: [ "pageshadow" ],
			offCanvas	: {
				position 	: "right",
				zposition	: "front"
			}
		});

		var API = $menu.data( "mmenu" );
		API.setSelected( $menu.find( "li" ).first() );

		var closer = null;

		$menu.find( 'a' ).on( 'click', function() {
			closer = $(this).attr( "href" );
		});

		API.bind( "closed", function() {
			if ( closer ) {
				setTimeout( function() {
					$html.animate({
						scrollTop: $(closer).offset().top
					});
					closer = null;
				}, 25 );
			}
		});
	});

})(jQuery);
