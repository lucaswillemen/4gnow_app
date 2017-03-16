app.controller('login', function($scope, $http, $httpParamSerializerJQLike, $state, $rootScope) {
    if (localStorage.uid) {
        $state.go("app.home")
    } else {
        open_overlay()
    }
    $scope.$on('$viewContentLoaded', function() {
        $('#form').formValidation().on('success.form.fv', function(e) {
            // Prevent form submission
            e.preventDefault();
            var send = {
                data: $scope.data,
                type: "email"
            }
            $http({
                method: 'jsonp',
                url: window.api + "api/login.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(res) {
                var data = res.data
                if (data.data.length == 0) {
                    $scope.FormError = true
                }
                if (data.data.length == 1) {
                    res = data.data[0]
                    localStorage.uid = res.id
                    localStorage.nome = res.nome
                    localStorage.revenda = res.revenda
                    $rootScope.nome = localStorage.nome
                    localStorage.security_token = res.token
                    $scope.FormError = false
                    $state.go("app.home")
                }
            })
        })
    });
    $("#face_login").click(function() {
        FB.login(function(response) {
            if (response.authResponse) {

                var send = {
                    facebook_id: response.authResponse.userID,
                    type: "facebook"
                }
                $http({
                    method: 'jsonp',
                    url: window.api + "api/login.php",
                    params: send,
                    paramSerializer: '$httpParamSerializerJQLike'
                }).then(function(data) {
                    var res = data.data.data[0]
                    if (data.data.data.length == 0) {
                        $scope.FormError = true
                    } else {
                        localStorage.uid = res.id
                        localStorage.nome = res.nome
                        localStorage.revenda = res.revenda
                        localStorage.facebook_picture = res.facebook_picture
                        $rootScope.nome = localStorage.nome
                        localStorage.security_token = res.token
                        $scope.FormError = false
                        $state.go("app.home")
                    }
                })
            }
        }, {
            scope: 'public_profile,email'
        });
    })
});