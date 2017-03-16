app.controller('indicados', function($scope, $rootScope, $state, $http) {
    open_overlay()
    console.log(localStorage.uid)
    $("#datatable").DataTable({
        "scrollX": true,
        "language": {
            "url": "assets/json/datatable.json"
        },
        "ajax": {
            "url": window.api + "api/indicados.php?&id=" + localStorage.uid,
            "dataType": "jsonp",
            "callback": "callback"
        },
        columns: [{
                data: "nome"
            },
            {
                data: "email"
            },
            {
                data: "telefone"
            },
            {
                data: "dataregistro"
            },
            {
                data: "vencimento"
            },
            {
                data: "id",
                render: function(data){
                    return '<a class="btn btn-success btnBonus btn-xs" data-id="45" data-toggle="modal" data-target="#modalBonus"><i class="fa fa-plus"></i> 24h</a>'+
                    ' <a class="btn btn-primary btnEditar btn-xs" data-id="45" data-toggle="modal" data-target="#modalEditar"><i class="fa fa-edit"></i> Editar</a>'
                }
            }
        ],
        "columnDefs": [{
            targets: 4,
            render: $.fn.dataTable.render.moment('YYYY-MM-DD', 'DD/MM/YYYY')
        },{
            targets: 3,
            render: $.fn.dataTable.render.moment('YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY')
        }],
    })
    $scope.$on('$viewContentLoaded', function() {

        var table = $('#datatable tbody')
        table.on('click', '.btnEditar', function() {
            var table = $('#datatable').DataTable();
            $scope.data_editar = table.row($(this).parents('tr')).data()
            $scope.$apply()
        });
        $('#modalEditar').on('hide.bs.modal', function(e) {
            $scope.data_editar={}
            $scope.$apply()
            $('#formEditar')[0].reset()
            $("#formEditar").data('formValidation').resetForm();
        })
        $('#formEditar').formValidation({
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'fa fa-refresh'
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();
            $scope.data_editar.email = $scope.data_editar.email.toLowerCase()

            var send = {
                data: $scope.data_editar,
                action: "edit",
                id: $scope.data_editar.id
            }
            $http({
                method: 'jsonp',
                url: window.api + "api/atualizar.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(res, status, header, config) {
                setTimeout(function() {$('#modalEditar').modal('hide')}, 10);
            })
        })


        var table = $('#datatable tbody')
        table.on('click', '.btnBonus', function() {
            var table = $('#datatable').DataTable();
            $scope.data_bonus = table.row($(this).parents('tr')).data()
            $scope.$apply()
        });
        $('#modalBonus').on('hide.bs.modal', function(e) {
            $scope.data_bonus={}
            $scope.$apply()
            $('#formBonus')[0].reset()
            $("#formBonus").data('formValidation').resetForm();
        })
        $('#formBonus').formValidation({
            icon: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'fa fa-refresh'
            }
        }).on('success.form.fv', function(e) {
            e.preventDefault();

            var send = {
                data: $scope.data_bonus,
                action: "edit",
                indicado: $scope.data_bonus.id
            }
            $http({
                method: 'jsonp',
                url: window.api + "api/ssh/bonus.php",
                params: send,
                paramSerializer: '$httpParamSerializerJQLike'
            }).then(function(res, status, header, config) {
                console.log(res.data)
                $scope.FormBonusStatus = !res.data.status
                $scope.FormBonusSuccess = res.data.status
            })
        })
    })
});