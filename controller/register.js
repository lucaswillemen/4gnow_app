app.controller('register', function($scope, $http, $httpParamSerializerJQLike, $state, $rootScope, $stateParams) {
    $http.jsonp(window.api + "api/check.php?email="+$stateParams.email).then(function(res) {
        var data = res.data
        open_overlay()
        if (data) {
            $scope.check = false
            $scope.data = {
                indicador : data.nome
            }   
            $scope.token = data.token         
        }else{
            $scope.check = true
        }
    })
    $scope.$on('$viewContentLoaded', function() {
        $('#form').formValidation({
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'fa fa-refresh'
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();
	        var send = {
	            data: $scope.data,
	            token: $scope.token
	        }
            $scope.overlay = true
	        $http({
	            method: 'jsonp',
	            url: window.api + "api/ssh/cadastro.php",
	            params: send,
	            paramSerializer: '$httpParamSerializerJQLike'
	        }).then(function(data, status, header, config) {
                var res = data.data	   
                console.log(res)
                $scope.FormError = false
                localStorage.uid = res.id
                localStorage.nome = res.user_name
                localStorage.revenda = 0
                localStorage.security_token = res.security_token
                $scope.overlay = false
                $state.go("app.home")
	        }, function(err){
                $scope.FormError = true
                $scope.overlay = false
            })
		})
    });
    $("#face_login").click(function() {
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', {fields: 'name,email'}, function(response) {
                  $scope.data.nome = response.name
                  $scope.data.email = response.email
                  $scope.data.facebook_id = response.id
                  $scope.data.facebook_loaded = true
                  $scope.$apply()

                });
                FB.api('/me/picture', function(response) {
                  $scope.data.facebook_picture = response.data.url
                })
            }
        }, {
            scope: 'public_profile,email'
        });
    })
});