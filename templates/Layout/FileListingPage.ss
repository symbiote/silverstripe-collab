<div class="typography">
	<div class="row">
		<div class="columns medium-12">
			<h1>$Title</h1>
			$Content
			$Form
		</div>
	</div>
	<div class="row">
		<div class="columns medium-6 medium-offset-6">
			$FileSearchForm
		</div>
	</div>
	<div class="row">
		<div class="columns medium-12">
			<div class="file-listing">
				<% if FolderLineage %>
					<div class="lineage">
						<ul class="inline-list clearfix">
							<% loop FolderLineage %>
								<% if First %>
									<li><a href="$Top.Link">$Title</a></li>
								<% else %>
									<li> / <a href="{$Top.Link}?cat=$ID">$Title</a></li>
								<% end_if %>
							<% end_loop %>
						</ul>
					</div>
				<% end_if %>
				
				<% if Files %>
					<table width="100%">
						<thead>
							<tr>
								<th width="36%">Name</th>
								<th width="10%">Type</th>
								<th width="10%">File size</th>
								<th width="20%">Last edited</th>
								<th width="24%">Tags</th>
							</tr>
						</thead>
						<tbody>
							<% loop Files %>
								<tr>
									<% if ClassName == "Folder" %>
										<% if Children %>
											<td class="name"><a href="$Location">$Title</a></td>
											<td class="filetype"><a href="$Location" class="folder">Folder</a></td>
										<% else %>
											<td class="name">$Title</td>
											<td class="filetype"><span class="folder">Folder</span></td>
										<% end_if %>
										<td>-</td>
										<td>-</td>
										<td>-</td>
									<% else %>
										<td class="name"><a href="$Location">$Title</a></td>
										<td class="filetype"><a href="$Location" title="$Title.XML" class="$Extension"></a>$Extension</td>
										<td>$getSize</td>
										<td class="version">$LastEdited.Nice<% if Owner %><br /><span class="owner">$Owner.Name</span><% end_if %></td>
										<td>
											<% if Terms %>
												<ul class="horiz-list tags">
													<% loop Terms %>
														<li><a href="{$Top.Link}?cat={$Top.SourceFolderID}&amp;term={$Name}">$Name</a></li>
													<% end_loop %>
												</ul>
											<% end_if %>
										</td>
									<% end_if %>
								</tr>
							<% end_loop %>
						</tbody>
					</table>
			
					<% with Files %>
						<% if MoreThanOnePage %>
							<ul class="pagination">
								<% if NotFirstPage %>
									<li class="arrow"><a href="{$PrevLink}">&laquo;</a></li>
								<% else %>
									<li class="arrow unavailable"><a href="{$PrevLink}">&laquo;</a></li>
								<% end_if %>
			
								<% loop PaginationSummary(4) %>
									<% if CurrentBool %>
										<li class="current"><a title="Viewing page {$PageNum} of results" class="disabled">{$PageNum}</a></li>
									<% else %>
										<% if Link %>
											<li><a title="View page {$PageNum} of results" class="<% if BeforeCurrent %>paginate-left<% else %>paginate-right<% end_if %>" href="{$Link}">{$PageNum}</a></li>
										<% else %>
											<li class="disabled"><a class="disabled">...</a></li>
										<% end_if %>
									<% end_if %>
								<% end_loop %>
			
								<% if NotLastPage %>
									<li class="arrow"><a href="{$NextLink}">&raquo;</a></li>
								<% else %>
									<li class="arrow unavailable"><a href="{$NextLink}">&raquo;</a></li>
								<% end_if %>
							</ul>
						<% end_if %>
					<% end_with %>
			
				<% else %>
					<p>Sorry, there are no files to view.</p>
				<% end_if %>
			
			</div>
		</div>
	</div>
</div>