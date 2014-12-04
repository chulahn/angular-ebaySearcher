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
        //data == filtered results
        //searchFilter for now is 

        return function(data, searchKey) {
        // return function(data, completedFilter, newFilter, searchKey) {
            if (typeof (data) === 'undefined' && typeof (searchKey) === 'undefined') {
                return 0;
            }

            var sum = 0;
            for (var i=0; i<data.length; i++) {
                sum += data[i][searchKey];
            }

            if ((data && data.length) == 0) {
                return 0;
            }
            return (sum / data.length).toFixed(2);
        }

    })
    


    .controller("dataController", function ($scope) {
        $scope.items = newItems;
    });

})(window.angular);