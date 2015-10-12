;
(function($) {

	// This name hasn't been updated to provide backwards compatibility for favourite lists.

	var LISTS_KEY = 'intranet-sis-fav-list';

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
			this.serverSave(this.lists);
		},
		allLists: function() {
			return this.lists;
		},

		trigger: function (name, data) {
		},
		serverSave: function(list) {
			var l = JSON.stringify(list);
			// Trigger a save on the server using a web service, against the current member.
			$.post('jsonservice/userList/saveSerialisedList', {
				list: l,
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
			})
		}
	};

	window.Lists = new ListManager();
	window.Lists.loadLists();
	
})(jQuery);