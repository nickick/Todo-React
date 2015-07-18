var items = []

var notifyComponents = function() {
  $(ListStore).trigger('storeHasChanged')
}

var findItemById = function(id) {
  return items.filter(function(item) {
    return item.id === id
  })[0]
},

ListStore = {

  getItems: function() {
    return items
  },

  loadItems: function(listName) {
    var loadRequest = $.ajax({
      type: 'GET',
      url: "https://listalous.herokuapp.com/lists/" + listName + "/"
    })

    loadRequest.done(function(dataFromServer) {
      items = dataFromServer.items
      notifyComponents()
    })
  },
  addItem: function(itemDescription) {
    var creationRequest = $.ajax({
      type: 'POST',
      url: "http://listalous.herokuapp.com/lists/NickHongList/items",
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
      url: "https://listalous.herokuapp.com/lists/NickHongList/items/" + itemId,
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
      url: "https://listalous.herokuapp.com/lists/NickHongList/items/" + itemId,
    })

    deleteRequest.done(function(deletedItemData) {
      var indexOfItem = items.indexOf(item)
      items.splice(indexOfItem,1);
      notifyComponents();
    })
  }
}
