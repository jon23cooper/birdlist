//clear existing class="active" tag then set class="active" for clicked tag
myBirdList.directive('jcTabClick', function(){
  return{
    link: function(scope, elem, attr){
      var tab=angular.element(elem);
      tab.on('click', function(){
        console.log("tab clicked", tab);
        var tabSet=tab.parent().parent();
        console.log("tab set=", tabSet);
        console.log("tab set children=",tabSet.children(".active"));
        //remove active class from currently active tab
        tabSet.children(".active").removeClass("active");
        tab.parent().addClass("active");
        console.log("tab parent=", tab.parent());
      })

    }
  }
});
