(function (){
  'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .directive('foundItems',FoundItems);

  function FoundItems(){
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onEmpty: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true
    };
    return ddo;
  }


  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var menu = this;
    menu.shortDescription = "";

    menu.getMatchedMenuItems = function(searchTerm){
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

      promise.then(function(items){
        if(items.length > 0) {
          menu.message = "";
          menu.found = items;
        }else{
          menu.message = "Nothing Found!";
          menu.found = [];
        }
      });
    };

    menu.removeItem = function(index) {
      menu.found.splice(index,1);
    }
  }



  MenuSearchService.$inject = ['$http'];
  function MenuSearchService ($http) {
    var service = this;
    service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
      }).then(function(response) {
        var foundItems = [];
        for(var i = 0; i < response.data['menu_items'].length; i++) {
          if(searchTerm.length > 0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
              foundItems.push(response.data['menu_items'][i]);
          }
        }
        return foundItems;
      });
    };
  }

})();
