(function(angular) {

angular.module('app',[])

    .filter('priceFilter', function() {
        return function(data, min, max) {
            var returnData = [];

            data.forEach(function(auction) {
                if (auction.price >= min && auction.price <= max) {
                    returnData.push(auction);
                }
            });
            return returnData;
        }
    })

    .filter('auctionSum', function() {


        return function(data, searchKey) {

            if (typeof (data) === 'undefined' || typeof (searchKey) === 'undefined') {
                return 0;
            }

            if ((data && data.length) == 0) {
                return 0;
            }

            var sum = 0;

            data.forEach(function(auction) {
                sum += auction[searchKey];
            });

            return (sum / data.length).toFixed(2);
        }

    })
    


    .controller("dataController", function ($scope) {
        $scope.items = newItems;
    });

})(window.angular);