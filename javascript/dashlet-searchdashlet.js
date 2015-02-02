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
						var list = data['list'];
						var query = data['query'];
						var output = "";
						
						if(query != "") {
							
							// Use these search results to create the output template.
							
							output += "<h3>'" + query + "' returned " + list.length + " result/s</h3>";
							
							if(list.length != 0) {
								output += "<ul class='search-list'>";
									for(var i = 0; i < list.length; i++) {
										output += "<li><div><h4><a href='" + list[i]['URL'] + "' data-pageid='" + list[i]['ID'] + "'>" + list[i]['Title'] + "</a></h4></div></li>";
									}
								output += "</ul>";
							}
							
							else {
								output += "<p>Sorry, your search query did not return any results.</p>";
							}
						}
						
						else {
							output += "<p class='invalid-search'>Please enter a search term.</p>";
						}
						
						// Display this output template in the search dashlet, and if it's the dynamic search we'll scroll to it.
						
						dashlet.html(output);
						dashlet.slideDown();
						
						if(!self.hasClass('static-search-dashlet-form')) {
							$("html, body").animate({
								scrollTop: dashlet.offset().top - 171
							}, 1000);
						}	
					}
				});
				
				
				
				// If this form is the static search dashlet, submit as the page loads.
				
				if(self.hasClass('static-search-dashlet-form')) {
					self.submit();
//					self.submit(function() {
//						dashlet.slideUp();
//						self.ajaxSubmit();
//						return false;
//					});

				}
			}
		});
		
	})
})(jQuery);
