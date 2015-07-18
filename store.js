var items = []
var errors = []

var notifyComponents = function() {
  $(ListStore).trigger('storeHasChanged')
}

var showErrors = function() {
  $(ListStore).trigger('hasErrors');
}

var findItemById = function(id) {
  return items.filter(function(item) {
    return item.id === id
  })[0]
}

ListStore = {
  listName: 'NickHongList',

  urlRoot: function() {
    return "http://listalous.herokuapp.com/lists/" + this.listName;
  },

  getItems: function() {
    return items
  },

  loadItems: function() {
    var loadRequest = $.ajax({
      type: 'GET',
      url: this.urlRoot()
    })

    loadRequest.done(function(dataFromServer) {
      items = dataFromServer.items
      notifyComponents()
    })

    loadRequest.error(function(err) {
      errors = err.responseText;
      $(ListStore).trigger('hasErrors')
    })
  },
  addItem: function(itemDescription) {
    var creationRequest = $.ajax({
      type: 'POST',
      url: this.urlRoot() + "/items",
      data: { description: itemDescription, completed: false }
    })

    creationRequest.done(function(itemDataFromServer) {
      items.push(itemDataFromServer);
      notifyComponents();
    })
  },
  toggleCompleteness: function(itemId) {
    var item = findItemById(itemId);
    var currentCompletedValue = item.completed

    var updateRequest = $.ajax({
      type: 'PUT',
      url: this.urlRoot() + "/items/" + itemId,
      data: { completed: !currentCompletedValue }
    })

    updateRequest.done(function(itemData) {
      item.completed = itemData.completed
      notifyComponents()
    })
  },
  deleteItem: function(itemId) {
    var item = findItemById(itemId);

    var deleteRequest = $.ajax({
      type: 'DELETE',
      url: this.urlRoot() + "/items/" + itemId,
    })

    deleteRequest.done(function(deletedItemData) {
      var indexOfItem = items.indexOf(item)
      items.splice(indexOfItem,1);
      notifyComponents();
    })
  },

  setErrors: function(newErrors) {
    errors = newErrors;
  },

  getErrors: function() {
    return errors;
  }
}
