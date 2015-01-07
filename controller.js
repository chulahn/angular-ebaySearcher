(function(angular) {

angular.module('app',[])

    .filter('priceFilter', function() {
        return function(data, pf) {
            var filteredData = [];
            data.forEach(function(auction) {
                if (auction.finalPrice >= pf.min && auction.finalPrice <= pf.max) {

                    var endDate = auction.endTime;
                    endDate = endDate.toDate();

                    if (endDate >= pf.start && endDate <= pf.end) {
                        filteredData.push(auction);
                    }
                }
            });

            //add auctions that user clicked
            selectedItems.forEach(function(selected) {
                if (filteredData.indexOf(selected) === -1) {
                    filteredData.unshift(selected);
                }
            });

            return filteredData;
        }
    })


    .controller("dataController", function ($scope) {
        $scope.items = newItems;
        $scope.minPrice = 0;
        $scope.maxPrice = 1000;
        $scope.defaultEarly = new Date("2013");
        $scope.defaultLate = new Date("2017");

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

        $scope.getOldest = function(items) {
            if (items === undefined || items.length === 0) {
                return "N/A";
            }

            var oldestTime = items[0].endTime;
            var oldest = items[0];

            items.forEach(function(auction) {

                if (auction.endTime < oldestTime) {

                    oldestTime = auction.endTime;
                    oldest = auction;

                }

            });
            return oldest;
        }

    });

})(window.angular);