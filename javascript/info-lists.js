;
(function($) {

	var LISTS_KEY = 'intranet-demo-fav-list';

	function ListManager() {
		this.lists = {};
	}

	ListManager.prototype = {

		loadLists: function() {
			if(localStorage) {
				var l = localStorage.getItem(LISTS_KEY);
				if (l && l.length) {
					this.lists = JSON.parse(l);
				}
			}
			if(!this.lists || ($.isEmptyObject(this.lists))) {
				// Load the list from the server when there is nothing found locally.
				this.serverLoad();
			}
		},
		getList: function(name) {
			if (this.lists[name]) {
				return this.lists[name];
			}

			var list = {
				name: name,
				items: []
			};
			this.lists[name] = list;
			return list;
		},
		deleteList: function (name) {
			if (this.lists[name]) {
				delete this.lists[name];
				this.save();
				$(document).trigger('listItemLoaded');
			} else {
			}
			
		},
		
		deleteFromList: function (listName, item) {
			var list = this.getList(listName);
			if (!list) {
				return;
			}
			
			var index = this.findListItem(list, item);
			if (index >= 0) {
				list.items.splice(index, 1);
			}

			this.save();
			$(document).trigger('listItemLoaded');
		},
		
		findListItem: function (list, item) {
			for (var index in list.items) {
				if (list.items[index].typeId == item) {
					return index;
				}
			}
			
			return -1;
		},
		
		addToList: function (listName, item) {
			var list = this.getList(listName);
			var index = this.findListItem(list, item);
			var existing = index > -1 ? list.items[index] : null;
			if (!existing) {
				existing = {title: item};
				existing.added = (new Date()).getTime();
			}

			existing.listId = list.name;
			existing.typeId = item;
			existing.updated = (new Date()).getTime();
			existing.needsLoading = true;
			
			list.items.push(existing);
			this.loadItem(existing);
		},

		/**
		 * Loads an item from the external API
		 * @param object item
		 * @returns null
		 */
		loadItem: function (item) {
			var params = {typeId: item.typeId};
			var _this = this;
			$.get('jsonservice/userList/dataForList', params).success(function (data) {
				if (data && data.response) {
					for (var key in data.response) {
						item[key] = data.response[key];
					}
					if (item.listId) {
						delete item.needsLoading;
						var list = _this.getList(item.listId);
						_this.saveList(list);
					}
					$(document).trigger('listItemLoaded');
				}
			});
		},
		saveList: function(list) {
			this.lists[list.name] = list;
			this.save();
		},
		save: function () {
			localStorage.setItem(LISTS_KEY, JSON.stringify(this.lists));

			// Save the list to the server for when there is nothing found locally.

			this.serverSave(JSON.stringify(this.lists));
		},
		allLists: function() {
			return this.lists;
		},

		trigger: function (name, data) {
		},
		serverSave: function(list) {

			// Trigger a save on the server using a web service, against the current member.

			$.post('jsonservice/userList/saveSerialisedList', {
				list: list,
				contentType: 'application/json'
			});

			// The current user has now had their list saved asynchronously, if they were logged in.

		},
		serverLoad: function() {
			// Trigger a load from the server using a web service, against the current member.
			$.ajax('jsonservice/userList/getSerialisedList', {
				async: false,
				contentType: 'application/json'
			}).done(function () {
				if (!window.Lists.lists) {
					window.Lists.lists = {};
				}
			}).success(function(data) {
				if(data && (data.response !== '')) {
					// The current user has an existing list, so return it.
					window.Lists.lists = JSON.parse(data.response);
				}
				else {
					// The current user is not logged in, so return an empty list.
					window.Lists.lists = {};
				}
			})
		}
	};

	window.Lists = new ListManager();
	window.Lists.loadLists();
	
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
				var listItem = $('<div class="save-list-item" data-id="' + list.items[itemId].typeId + '"></div>');
				listItem.attr('data-list', listName);
				listItem.append('<a class="delete char-icon deleteItem" href="#"><span class="typcn typcn-trash"></span></a>');
				listItem.append('<a href="#" class="save-list-item-title"></a>');
				listItem.find('.save-list-item-title').text(list.items[itemId].Title);
				
				listItem.append('<div class="save-list-item-content">' + list.items[itemId].Content + '</div>');
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