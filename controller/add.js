app.controller('add', function($scope, $rootScope, $state, $http, $localStorage, $filter) {

    $http({
        method: 'jsonp',
        url: window.api + "api/pacotes.php"        
    }).then(function(res) {
        var data = res.data
        $scope.pacotes = data.data
        console.log($scope.data.valor)
        open_overlay()
    })
    $scope.data = {}

    $scope.step = 'info'
    $scope.today = new Date()


    $scope.data.card = 4235647728025682
    Mercadopago.setPublishableKey("TEST-b135d529-8498-4fe3-b3e3-d7fc43ce5ce4");


    $scope.test_card = function() {
        var c = $filter('limitTo')($scope.data.card, 6)
        Mercadopago.getInstallments({
            bin: c,
            amount: $scope.data.valor
        }, function(r, s) {
            console.log(s);
            $scope.card_d = s
            $scope.data.parc = s[0].payer_costs[0].installment_amount
            $scope.$apply()
        })
    }
    $scope.pay = function() {
        
        var element = document.getElementById('formPayment');
        var form = $httpParamSerializerJQLike($scope.data)
        Mercadopago.createToken(element, function(e, r) {
            if (r.error) {
                alert("Ocorreu um erro: " + JSON.stringify(r));
            } else {
                $scope.send_pay = {
                    "val": $scope.data.valor,
                    "installments": $scope.data.parc,
                    "token": r.id,
                    "desc": "Compra de crédito SorteioSocial",
                    "payment_method_id": $scope.card_d[0].payment_method_id,
                    "payer": {
                        "email": $scope.data.email
                    }
                }
                console.log($scope.send_pay)
        		$scope.step = 'confirm'
            	$scope.response_mp = r            	
            	console.log($scope.response_mp)
                $scope.$apply()
            }
        })
    }
    $scope.submit_pay = function(){
    	$rootScope.socket.emit("pay", $scope.send_pay, $localStorage.user._id)	
	    $rootScope.socket.removeListener("confirm_pay")
        $rootScope.socket.on("confirm_pay", function(r){
        	console.log(r)
        	if (r.error != 'refused') {        		
        		$scope.step = 'approved'
                $localStorage.user.points=r.value.points      
        		$scope.$apply()		
        	}else{
        		$scope.step = 'repproved'
        	}

        	$scope.load_show = false
        	$scope.$apply()
        })
    }
});