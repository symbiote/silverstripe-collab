;(function ($) {
	var dialog = null; 
	
	var closeAllDialogs = function(){
//		 $('.reveal-modal').foundation('reveal', 'close');
		dialog.modal('hide');
	}
	
	var showDialog = function (content, title, okClass) {
		dialog.find('.modal-body').html(content);
		if (title) {
			dialog.find('.modal-title').html(title);
		}
		dialog.find('button.btn-primary').attr('class', 'btn btn-primary');
		if (okClass) {
			dialog.find('button.btn-primary').addClass(okClass);
		} else {
			dialog.find('button.btn-primary').addClass('hidden');
		}
		dialog.modal();
	}

	var template = '<div class="list-saver">\n\
<a href="#" class="add-to-list" title="Add to Favourites" data-tooltip aria-haspopup="true"><span class="fa fa-plus-circle"></span></a>\n\
</div>';
	
	var infoListModal = '<div class="modal fade" id="info-list-modal" role="dialog">\n\
	<div class="modal-dialog">\n\
	  <div class="modal-content">\n\
		<div class="modal-header">\n\
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n\
          <h4 class="modal-title"></h4>\n\
        </div>\n\
        <div class="modal-body">\n\
        </div>\n\
        <div class="modal-footer">\n\
	      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n\
          <button type="button" class="btn btn-primary">OK</button>\n\
        </div>\n\
    </div>\n\
  </div>\n\
</div>';
	
	var saveFormTemplate = '<div class="list-save-info">\n\
<div class="list-save-field"><label for="new-item-list">Create new list</label><input type="text" name="newlist" placeholder="New list" id="new-item-list"/></div>\n\
<div class="list-save-field"><label for="existing-item-list">Or select existing list</label><select id="existing-item-list" class="existing-lists"></select></div>\n\
</div>';
	
	var formHolder = null;

	$.fn.listSaver = function() {
		var saveForm = $('.list-save-info');
		
		if (!saveForm.length) {
			var saveHolder = $('.list-save-placeholder');
			if (saveHolder.length > 0) {
				formHolder = saveHolder;
			} else {
				formHolder = $('<div class="default-save-placeholder"></div>');
				$('body').append(formHolder);
			}
			formHolder.append(saveFormTemplate);
			saveForm = $('.list-save-info');
		}

		this.each(function() {
			var context = $(this);
			if (context.find('.list-saver').length == 0) {
				var elems = $(template);
				$(this).prepend(elems);
			}

			$(this).find('> .list-saver .add-to-list').click(function (e) {
				e.preventDefault();
				
				var cur = $(this).text();

				var lists = Lists.allLists();
				saveForm.find('input[name=newlist]').val('');
				var select = saveForm.find('.existing-lists');
				select.empty();
				select.append('<option value="">(select list)</option>');
				for (var name in lists) {
					var opt = $('<option>');
					opt.text(name).attr('value', opt.text());
					select.append(opt);
				}
				
				saveForm.attr('data-for-save', context.attr('data-saveable-info'));
				var html = formHolder.html();
				var title = $('div.main h1').text();
				
				showDialog(html, 'Save', 'save-to-list');

				return false;
			});
		});
		
		return this;
	};

	$(function() {
		dialog = $('#info-list-modal');
		// create modal 
		if (dialog.length === 0) {
			dialog = $(infoListModal);
			$('body').append(dialog);
		}
		
		var renderList = function (intoElem) {
			var items = Lists.allLists();
			intoElem.empty();
			if (typeof(items) == 'object' && !($.isEmptyObject(items))) {
				for (var name in items) {
					var number = items[name].items.length;
					var link = $('<a href="#" class="info-list"></a>').attr('data-list-name', name).text(name + ' (' + number + ')');
					intoElem.append(
						$('<li class="saved-list-entry"></li>')
							.append(link)
					);
				}
//				$(document).foundation('tooltip','reflow');
			}
		};

		$('[data-saveable-info]').entwine({
			onmatch: function() {
				$(this).listSaver();
			}
		});

		var listTarget = $('.saved-info-listing');
		if (listTarget.length) {
			$(document).on('listItemLoaded', function (e) {
				listTarget.each(function () {
					renderList($(this));
				});
			});
			
			listTarget.each (function () {
				renderList($(this));
//				$(document).foundation('topbar', 'reflow');
			});
		}
		
		$(document).on('click', 'a.info-list', function (e) {
			e.preventDefault();
			$('#fav-modal.reveal-modal').remove();
			var listName = $(this).attr('data-list-name');
			var list = Lists.getList(listName);
			
			var listPopup = $('<div id="fav-modal-contents"/>');
			listPopup
				.append($('<div class="buttons-1"/>').text(listName))
				.append($('<button/>')
					.addClass('char-icon')
					.attr({'aria-haspopup': true, 'data-tooltip': '', 'title': 'Delete this list ('+listName + ')'})
					.click(function(){
						if (confirm("Delete " + listName +"?")) {
							Lists.deleteList(listName);
							closeAllDialogs();
						}
						return false;
					})
					.append('<span class="fa fa-minus-circle"></span><span class="visually-hidden">Delete</span>')
				);
			for (var itemId in list.items) {
				if (!list.items[itemId]) {
					continue;
				}
				var item = list.items[itemId];
				var listItem = $('<div class="save-list-item" data-id="' + item.typeId + '"></div>');
				
				listItem.attr('data-list', listName);
				listItem.append('<a href="#" class="save-list-item-title"></a>');
				listItem.find('.save-list-item-title').text(item.Title);
				
				listItem.append('<a class="delete char-icon deleteItem" href="#"><span class="fa fa-minus-circle"></span></a>');
				if (item.Link) {
					listItem.append('<a class="navigate char-icon openItem" href="' + item.Link + '"><span class="fa fa-arrow-circle-right"></span></a>');
				}
				
				listItem.append('<div class="save-list-item-content">' + item.Content + '</div>');
				listPopup.append(listItem);
			}
			showDialog(listPopup);
			return false;
		});

		$(document).on('click', 'a.deleteItem', function (e) {
			e.preventDefault();
			var listItem = $(this).parents('.save-list-item');
			var typeId = listItem.attr('data-id');
			var listName = listItem.attr('data-list');
			if (typeId && listName) {
				Lists.deleteFromList(listName, typeId);
				listItem.remove();
			}
			return false;
		})

		$(document).on('click', 'a.save-list-item-title', function (e) {
			e.preventDefault();
			$(this).siblings('.save-list-item-content').toggle();
			return false;
		});
		
		$(document).on('click', 'button.save-to-list', function () {
			var saveForm = $(this).parents('.modal-dialog').find('.list-save-info');
			var newList = saveForm.find('input[name=newlist]').val();
			var existing = saveForm.find('.existing-lists').val();
			var listName = newList.length ? newList : existing;
			if (listName.length) {
				var toSave = saveForm.attr('data-for-save');
				Lists.addToList(listName, toSave);
			}
			closeAllDialogs();
		});

		$(document).on('click', 'a.list-save-form-close', function (e) {
			e.preventDefault();
			$('.add-to-list-open').click();
			return false;
		});

		$(document).on('click', 'nav .saved-list-entry > .delete', function(e){
			e.preventDefault();
			var listName = $(this).prev().data('listName');
			if (confirm("Delete " + listName +"?")) {
				Lists.deleteList(listName);
			}
		});
	});
})(jQuery);