(function(angular) {

angular.module('app',[])

    .filter('auctionSum', function() {
        //data == filtered results
        //searchFilter for now is 

        return function(data, searchKey) {
        // return function(data, completedFilter, newFilter, searchKey) {
            if (typeof (data) === 'undefined' && typeof (searchKey) === 'undefined') {
                return 0;
            }

            // var sum = data.reduce(function(total, current) {
            //     console.log("data length", data.length, "total ", total, "current ", current)
            //     if (completed) {
            //         if (current.status !== "EndedWithoutSales") {
            //             return (total[searchFilter] || total || 0) + current[searchFilter];
            //         }
            //     }
            //     else {
            //         return (total[searchFilter] || total || 0) + current[searchFilter];
            //     }
            // });

            var sum = 0;
            for (var i=0; i<data.length; i++) {
/*
                //if searching for completed items, only add with status is endedwithoutsales
                if (completedFilter) {

                    if (data[i].status !== "EndedWithoutSales") {

                        //if searching for brand new Items, add only the items that have a condition id 1XXX
                        if (newFilter) {
                            var shortCondID = parseInt(data[i].shortCondID);
                            if (shortCondID === 1) {
                                sum += data[i][searchKey];
                            }
                            // if (conditionID >= 1000 && conditionID < 2000) {
                            //     sum += data[i][searchKey];
                            // }
                        }
                        else {
                            sum += data[i][searchKey];
                        }
                    
                    }
                }
                
                else {

                    if (newFilter) {
                        var shortCondID = parseInt(data[i].shortCondID);
                            if (shortCondID === 1) {
                                sum += data[i][searchKey];
                        }
                        // var conditionID = parseInt(data[i].conditionID);
                        // if (conditionID >= 1000 && conditionID < 2000) {
                        //     sum += data[i][searchKey];
                        // }
                    }
                    
                    else {
                        */
                        sum += data[i][searchKey];
                //     }
                
                // }
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