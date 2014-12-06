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


    .controller("dataController", function ($scope) {
        $scope.items = newItems;


        $scope.getAvg = function(items, searchKey) {

            if (typeof (items) === 'undefined' || typeof (searchKey) === 'undefined') {
                return 0;
            }

            if ((items && items.length) == 0) {
                return 0;
            }

            var sum = 0;
            items.forEach(function(auction) {
                    sum += auction[searchKey];
            });

            return (sum / items.length).toFixed(2);
        }
        $scope.getMin = function(items, searchKey) {

            if (typeof (items) === 'undefined' || typeof (searchKey) === 'undefined' || items.length === 0) {
                return 0;
            }
            var min = items[0][searchKey];
            var minIndex = 0;

            items.forEach(function(auction) {

                if (auction[searchKey] < min) {
                    min = auction[searchKey];
                    minIndex = items.indexOf(auction);
                }

            });

            return items[minIndex];

        }
        $scope.getMax = function(items, searchKey) {

            if (typeof (items) === 'undefined' || typeof (searchKey) === 'undefined' || items.length === 0) {
                return 0;
            }
            var max = items[0][searchKey];
            var maxIndex = 0;

            items.forEach(function(auction) {

                if (auction[searchKey] > max) {
                    max = auction[searchKey];
                    maxIndex = items.indexOf(auction);
                }

            });

            return items[maxIndex];

        }


    });

})(window.angular);