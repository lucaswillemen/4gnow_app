app.controller('extrato', function($scope, $rootScope, $state, $http) {
    open_overlay()
    $("#datatable").DataTable({
        "scrollX": true,
        "language": {
            "url": "assets/json/datatable.json"
        },
        "ajax": {
            "url": window.api + "api/extrato.php?type=list&uid=" + localStorage.uid,
            "dataType": "jsonp",
            "callback": "callback"
        },
        columns: [{
                data: "dataregistro"
            },
            {
                data: "cliente"
            },
            {
                data: "ponto"
            },
            {
                data: "des"
            }
        ],
        "columnDefs": [{
            targets: 0,
            render: $.fn.dataTable.render.moment('YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY HH:mm')
        }]
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
                action: "create"
            }
         
            $http({
                method: 'jsonp',
                url: window.api + "api/servidores.php?callback=JSON_CALLBACK",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).success(function(data) {
                console.log(data)
                if (data.data.length == 0) {
                    $scope.AddPaciente = "cadastro"
                }
                if (data.data.length == 1) {
                    res = data.data[0]
                    $scope.AddPaciente = "adicionar"
                }
            })
        })
    })
});