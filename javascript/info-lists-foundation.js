;(function ($) {
	
	var closeAllDialogs = function(){
		 $('.reveal-modal').foundation('reveal', 'close');
	}

	var template = '<div class="list-saver">\n\
<a href="#" class="add-to-list" title="Add to Favourites" data-tooltip aria-haspopup="true"><span class="typcn typcn-bookmark"></span></a>\n\
</div>';
	
	var saveFormTemplate = '<div class="list-save-info">\n\
<div class="list-save-field"><input type="text" name="newlist" placeholder="New list"/></div>\n\
<div class="list-save-field"><select class="existing-lists"></select></div>\n\
<div class="list-save-field"><button class="save-to-list">Save</button></div>\n\
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
			var elems = $(template);
			$(this).prepend(elems);
			
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
//					saveForm.show();
				var title = $('div.main h1').text();
				var $modal = $('<div id="fav-modal" class="reveal-modal small list-item-save-form" data-reveal="" />')
					.append('<a class="close-reveal-modal">&times;</a>')
					.append($('<div class="modal-heading"/>').html('Add: '+title))
					.append(html);
				
				$('#fav-modal').remove();
				$('body').append($modal);
				$(document).foundation('reveal','reflow');
				$modal.foundation('reveal', 'open');
				
				return false;
			});
		});
		$(document).foundation('tooltip','reflow');
		
		return this;
	};

	$(function() {
		
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
				$(document).foundation('tooltip','reflow');
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
				$(document).foundation('topbar', 'reflow');
			});
		}
		
		$(document).on('click', 'a.info-list', function (e) {
			e.preventDefault();
			$('#fav-modal.reveal-modal').remove();
			var listName = $(this).attr('data-list-name');
			var list = Lists.getList(listName);
			
			var listPopup = $('<div id="fav-modal" class="reveal-modal full" data-reveal="" />');
			listPopup
				.append('<a class="close-reveal-modal">&times;</a>')
				.append($('<div class="modal-heading buttons-1"/>').html(listName))
				.append($('<button/>')
					.addClass('char-icon')
					.attr({'aria-haspopup': true, 'data-tooltip': '', 'title': 'Delete '+listName})
					.click(function(){
						if (confirm("Delete " + listName +"?")) {
							Lists.deleteList(listName);
						}
						listPopup.foundation('reveal', 'close');
					})
					.append('<span class="typcn typcn-trash"></span><span class="visually-hidden">Delete</span>')
				);
			for (var itemId in list.items) {
				if (!list.items[itemId]) {
					continue;
				}
				var item = list.items[itemId];
				var listItem = $('<div class="save-list-item" data-id="' + item.typeId + '"></div>');
				listItem.attr('data-list', listName);
				listItem.append('<a class="delete char-icon deleteItem" href="#"><span class="typcn typcn-trash"></span></a>');
				if (item.Link) {
					listItem.append('<a class="navigate char-icon openItem" href="' + item.Link + '"><span class="typcn typcn-arrow-forward-outline"></span></a>');
				}
				listItem.append('<a href="#" class="save-list-item-title"></a>');
				listItem.find('.save-list-item-title').text(item.Title);
				
				listItem.append('<div class="save-list-item-content">' + item.Content + '</div>');
				listPopup.append(listItem);
			}
			$('body').append(listPopup);

			$(document).foundation('reveal','reflow');
			$(document).foundation('tooltip','reflow');
			listPopup.foundation('reveal', 'open');

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
			var saveForm = $(this).parents('.list-save-info');
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