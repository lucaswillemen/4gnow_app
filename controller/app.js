
var app = angular.module('StartApp', ['ui.router','ngStorage','ui.utils.masks']);
function open_overlay (){
	$("body").removeClass("loading-overlay-showing")
}
//App principal
app.controller('Main', function($scope, $rootScope, $state, $http) {
	$rootScope.mobile = window.mobile
	$http.jsonp(window.api + "api/version.php", {jsonpCallbackParam: 'callback'}).then(function(res) {
        if (res.data.v != window.version) {
        	$("#modalAtualizar").modal("show")

            $scope.new_version = function(){
                window.open("whatsapp://send?text=Dados de conexão %0AEmail: "+res.user_con+" %0ASenha: "+res.senha_con, "_system")
            }
        }
    })
	$rootScope.logout = function(){
		localStorage.clear()
		$state.go("login")
	} 
	if (localStorage.security_token) {
		$rootScope.nome = localStorage.nome
		$rootScope.revenda = localStorage.revenda
		$rootScope.facebook_picture = localStorage.facebook_picture
	}else{
		$state.go("login")
	}
	$rootScope.$on('$stateChangeSuccess', 
	function(event, toState, toParams, fromState, fromParams){ 
	    $("html").removeClass("sidebar-left-opened")
	})
	$rootScope.$on('$stateChangeStart', 
	function(event, toState, toParams, fromState, fromParams){ 
	    $("body").addClass("loading-overlay-showing")
	})
})

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://4gnow.com.br/**'
  ]);
  $sceDelegateProvider.resourceUrlBlacklist([
  ]);
});
