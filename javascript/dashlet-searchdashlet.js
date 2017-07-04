;(function($) {
	$(function () {
		// If the search dashlet exists, we want to attach the handlers to it using entwine.
		$('.search-dashlet-form').entwine({
			onmatch: function() {
				var self = $(this);
				var dashlet = self.parents('.search-dashlet-content');

				// If this is the dynamic search dashlet, we want to display the search form for the user.

				if(!self.hasClass('static-search-dashlet-form')) {
					dashlet = dashlet.find('.dynamic-search-dashlet-content');
				}

				self.ajaxForm({
					success: function(data) {

						// Display this output template in the search dashlet, and if it's the dynamic search we'll scroll to it.

						dashlet.html(data);
						dashlet.slideDown();

						if(!self.hasClass('static-search-dashlet-form')) {
							$("html, body").animate({
								scrollTop: dashlet.offset().top - 171
							}, 1000);
						}
					}
				});
			}
		});

	})
})(jQuery);
