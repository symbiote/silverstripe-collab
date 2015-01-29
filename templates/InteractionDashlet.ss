<div class="dashlet-content-anchor interaction-dashlet-content" data-link="$Link">
	<% if Items %>
		<ol class="interaction-dashlet-title">
			<% loop Items %>
				<li><a href="$Link" data-pageid="$ItemID">$Title</a> $Views views</li>
			<% end_loop %>
		</ol>
	<% end_if %>
</div>