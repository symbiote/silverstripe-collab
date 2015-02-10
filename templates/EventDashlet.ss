<div id='event-dashlet-{$ID}' class="event-dashlet">

	<% if Events %>
		<% loop Events %>
			<p>
				<div><a href='{$Link}'>{$Title}</a></div>
				<div>{$StartDate.Nice}<% if $EndDate != $StartDate %> - {$EndDate.Nice}<% end_if %></div>
				<div><% if not AllDay %>{$StartTime.Nice} - {$EndTime.Nice}<% end_if %></div>
			</p>
		<% end_loop %>
	<% else %>
		<p>There is no calendar selected.</p>
	<% end_if %>

</div>
