;(function ($) {
	$(function () {
		$('.announcement-dashlet-content .rss-container').entwine({
			onmatch: function () {
				// load up the rss 
				var container = $(this);
				var parent = $(this).parents('.AnnouncementDashlet');
				
				$.get(parent.attr('data-link') + '/rssfeed').success(function (data) {
					container.html(data);
				});
				
			}
		})
	})
}(jQuery));