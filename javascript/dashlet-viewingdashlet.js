;(function($) {
	$(function () {
		
		// When an anchor has been clicked that contains the "data-pageid" attribute.
		$(document).on('click', 'a[data-pageid]', function () {

			// Make sure a viewing dashlet with the "data-dynamicviewer" attribute as true exists.
			if ($(".viewing-dashlet-content[data-dynamicviewer = 1]").length > 0) {
				// Trigger the viewing dashlet event for this specific page.
				$(this).trigger('dashletview', [$(this)]);
				// Return false such that we don't have the page redirect.
				return false;
			} else {
				// If the specified viewing dashlet can't be found, we want to redirect to that selected page.
				return true;
			}
		});
		
		// When an anchor has been clicked from inside a viewing dashlet.
		
		$(document).on('click', '.viewing-dashlet-content a', function () {

			// Handle a media page from the viewing dashlet.

			if($(this).hasClass('media-page')) {

				// Toggle the expansion/collapse of the media page.

				$(this).parent().parent().parent().children('.media-page-toggle').slideToggle();
				return false;
			}
			else if($(this).hasClass('external')) {

				// Open a new page with the external link.

				return true;
			}
			
			// Get the viewing dashlet that this request came from, incase we have multiple viewing dashlets.
			
			var viewer = $(this).parents('.viewing-dashlet-content');
			var url = $(this).attr('href');
			var link = viewer.attr('data-link');
			
			// Call our display method to replace viewer's contents.
			
			$.get(link + '/display', {pageURL: url}, function (data) {
				
				// If our response was invalid, we don't want to change the viewer content.
				
				if(data != 'invalid_page') {
					viewer.html(data);

					// Scroll the screen to this viewing dashlet.

					$("html, body").animate({
						scrollTop: viewer.offset().top - 88
					}, 1000);

					$(document).trigger('interactionupdate');
				}
			});
			
			return false;
		});
		
		// Define the viewing dashlet event for the document, that will be called by selecting a specific anchor.
		
		$(document).on('dashletview', function (e, obj) {
			id = obj.attr('data-pageid');
			
			// Find this dashlet to load our page into.
			
			var viewer = $(".viewing-dashlet-content[data-dynamicviewer = 1]");
			var link = viewer.attr('data-link');
			
			// Call our display method to replace viewer's contents.
			
			$.get(link + '/display', {pageID: id}, function (data) {
				viewer.html(data);
				
				// Scroll the screen to the viewing dashlet.
				
				$("html, body").animate({
					scrollTop: viewer.offset().top - 88
				}, 1000);
				
				obj.trigger('interactionupdate');
			});
		});
		
		$(document).on('interactionupdate', function (e) {
			
			// Update the interaction dashlet to reflect updates, if it exists.
			
			var interaction = $(".interaction-dashlet-content");
			
			if (interaction.length > 0) {
				var interactionLink = interaction.attr('data-link');
				
				// Call the items method to update the interaction dashlet's contents.
				
				$.get(interactionLink + '/items', {pageFlag: true}, function (data) {
					
					var list = data['list'];
					var output = "";
					
					output += "<ol class='interaction-dashlet-title'>";
						for(var i = 0; i < list.length; i++) {
							output += "<li><a href='" + list[i]['URL'] + "' data-pageid='" + list[i]['ItemID'] + "'>" + list[i]['Title'] + "</a> " + list[i]['Views'] + " views</li>";
						}
					output += "</ol>";
					
					interaction.html(output);
				});
			}
		});
		
	})
})(jQuery);
