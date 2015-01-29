<div id="announcement-dashlet-{$ID}" class="dashlet-content-anchor announcement-dashlet-content" data-link="{$Link}">

	<% if $ShowAnnouncements %>
	
		<% with $Announcement %>
			<p><% if $Abstract %>$Abstract<% else %>$Content.FirstParagraph</p><% end_if %>
			<p><a href="$Link" title="Read full '$Title.XML' article">Full article...</a></p>
		<% end_with %>
	
	<% end_if %>
	
	<div class="rss-container">
		<img src="cms/images/loading.gif" />
	</div>
	
</div>
