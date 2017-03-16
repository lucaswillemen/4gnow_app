app.controller('adicionar', function($scope, $rootScope, $state, $http) {


        open_overlay()
    $scope.go_back = function(){
            $scope.complete = false
            $scope.data = {}
            $('#form')[0].reset()
            setTimeout(function() {
                
            $("#form").data('formValidation').resetForm();
            }, 50);
        }
    $scope.$on('$viewContentLoaded', function() {
        $('#form').formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'fa fa-refresh'
            },
            row: {
                valid: 'has-success',
                invalid: 'has-error'
            },
            fields: {
                'celular': {
                    validators: {
                        notEmpty: {
                            message: 'Informe o celular'
                        }
                    }
                }
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();
            $scope.data.email = $scope.data.email.toLowerCase()

            var send = {
                data: $scope.data,
                action: "create",
                token: localStorage.security_token
            }
            $scope.overlay = true
            $scope.$apply()

           $http({
                method: 'jsonp',
                url: window.api + "api/ssh/cadastro.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(r) {
                console.log(r)
                var res = r.data
                $scope.overlay = false
                $scope.complete = true
                $scope.res = res
                $scope.form_error = false
                $scope.whatsapp_open = function(){
                    window.open("whatsapp://send?text=Dados de conexão %0AEmail: "+res.user_con+" %0ASenha: "+res.senha_con+" %0AArquivo EHI: http://4gnow.com.br/app/ehi/"+res.user_con, "_system")
                }
            }, function(err){
                $scope.form_error = true
                $scope.overlay = false
                console.log(err)
            })
        })
    })
});