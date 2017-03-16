app.controller('revenda', function($scope, $rootScope, $state, $http, $filter) {

    //Load data home
    $http.jsonp(window.api + "api/home.php?token="+localStorage.security_token).then(function(res) {
        $scope.data = res.data.user
        $scope.revenda_link = "https://4gnow.com.br/app/indicador/"+$scope.data.email
        open_overlay()
    })




    $scope.$on('$viewContentLoaded', function() {

        //Solicitar saque
        $("#btnEnviar").click(function() {
            $scope.FormEnviarStatus = false
            $scope.FormEnviarSuccess = false
            $('#formEnviar')[0].reset()    //Load indicados
            $http.jsonp(window.api + "api/indicados.php?id=" + localStorage.uid).then(function(res) {
                $scope.indicados = res.data.data
                $("#ativar_transferir").select2({
                    placeholder: 'Selecione um cliente',
                    allowClear: true,
                    theme: "bootstrap",
                    data: $scope.indicados,
                    width: '100%'
                }).change(function(e) {
                    $('#formEnviar').formValidation('revalidateField', 'ativar_transferir');
                })
            })
        })
        $('#modalEnviar').on('hide.bs.modal', function(e) {
            $scope.completeEnviar = false
            $scope.$apply()
            $("#formEnviar").data('formValidation').resetForm();
        })
        $('#formEnviar').formValidation({
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'fa fa-refresh'
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();

            var send = {
                indicado: $("#ativar_transferir").val(),
                cotas: $("#cotas").val(),
                token: localStorage.security_token
            }

            $http({
                method: 'jsonp',
                url: window.api + "api/transferir.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(res, status, header, config) {
                var data = res.data
                console.log(data)
                $scope.FormEnviarStatus = !data.status
                    $scope.FormEnviarSuccess = data.status
                if (data.status) {
                	var valor = parseFloat(data.cotas)
                	$scope.data.saldo -= valor
            	}else{         		
            	}
            })
        })


        //Solicitar ativação
        $("#btnAtivar").click(function() {
            $('#formAtivar')[0].reset()//Load indicados
            $http.jsonp(window.api + "api/indicados.php?id=" + localStorage.uid).then(function(res) {
                $scope.indicados = res.data.data
                $("#ativar_email").select2({
                    placeholder: 'Selecione um cliente',
                    allowClear: true,
                    theme: "bootstrap",
                    data: $scope.indicados,
                    width: '100%'
                }).change(function(e) {
                    $('#formAtivar').formValidation('revalidateField', 'ativar_email');
                })
            })
        })
        $('#modalAtivar').on('hide.bs.modal', function(e) {
            $scope.overlayAtivar = false
            $scope.completeAtivar = false
            $scope.$apply()
            $("#formAtivar").data('formValidation').resetForm();
        })
        $('#formAtivar').formValidation({
            framework: 'bootstrap',
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close'
            },
            row: {
                valid: 'has-success',
                invalid: 'has-error'
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();
            $scope.overlayAtivar = true

            var send = {
                indicado: $("#ativar_email").val(),
                token: localStorage.security_token
            }

            $http({
                method: 'jsonp',
                url: window.api + "api/ssh/ativar.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(res, status, header, config) {
                var data = res.data
                console.log(data);
                if (data.status) {
                    $scope.data_ativar = data
                    $scope.completeAtivar = true
                    $scope.FormAtivarStatus = false
                    $scope.overlayAtivar = false
                    $scope.data.saldo -= 1
                    $scope.whatsapp_open = function(){
                        window.open("whatsapp://send?text=Mensalidade ativada %0AVencimento: "+$filter('date')($scope.data_ativar.vencimento, 'dd/MM/yyyy'), "_system")
                    }
                }else{
                    $scope.FormAtivarStatus = true
                    $scope.overlayAtivar = false
                }
            })
        })
    })
});