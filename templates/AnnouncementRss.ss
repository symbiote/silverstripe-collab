	<% if $getRSS %>
		<% if $RssHeader %>
		<h3>$RssHeader</h3>
		<% end_if %>
		<% loop $RSS %>
			<div class='rss-item'>
				<div><a href='{$link}' target='_blank' class='external'>{$title}</a></div>
				<div><em>{$ItemDate.Nice}</em></div>
			</div>
			<br>
		<% end_loop %>
	<% else %>
	<p>Feed currently unavailable</p>
	<% end_if %>