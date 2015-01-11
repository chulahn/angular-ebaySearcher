var selectedItems = [];
var selectedMin = selectedItems[0];
var selectedMax = selectedItems[0];

$(document).ready(function() {

	$('#newSearchDiv').hide();

	$('#newSearch').click(function() {

		$(this).toggleClass('clickedButton');

		if ($(this).hasClass('clickedButton')) {
			$('#newSearchDiv').show();
		}
		else {
			$('#newSearchDiv').hide();
		}
	});

	/*
		Click Handler for checkboxes in table
		Highlights the row, adds item to selectedItems, and updates selectedItemsDiv
	*/
	$('#searchResultsTable').on('click', 'input[type="checkbox"]', function() {
		
		var items = angular.element($('[ng-controller=dataController')).scope().items;
		
		var selectedItemIndex = parseInt($(this).attr('id'));
		var currentItem = items[selectedItemIndex];
		currentItem.index = items.indexOf(currentItem);

		var currentRow = $(this).parent().parent();
		currentRow.toggleClass('highlighted');

		// console.log(currentItem.id);

		if (currentRow.hasClass('highlighted')) {
			selectedItems.push(currentItem);
		}

		else {
			// console.log("removed from index ", removeIndex)
			var removeIndex = selectedItems.indexOf(currentItem);
			selectedItems.splice(removeIndex,1);
		}

		updateSelectedDataDiv();
	});


});

//Recalculates average price(before/after shipping), min/max and updates div
function updateSelectedDataDiv() {

	function calcAvg(searchKey) {
		if (selectedItems.length !== 0) {
			if (selectedItems.length === 1) {
				return selectedItems[0][searchKey];
			}
			var total = selectedItems.reduce(function (total, current) {
						return (parseFloat(total[searchKey] || total || 0) + parseFloat(current[searchKey]));
						});
			return (total / selectedItems.length).toFixed(2);
		}
		else {
			return 0;
		}
	}

	function getMax(searchKey) {

	    if (typeof (selectedItems) === 'undefined' || typeof (searchKey) === 'undefined' || selectedItems.length === 0) {
			return 0;	
	    }

        var maxPrice = selectedItems[0][searchKey];
        var max = selectedItems[0];
        selectedItems.forEach(function(auction) {

            if (auction[searchKey] > maxPrice) {
                maxPrice = auction[searchKey];
                max = auction;
            }

        });

        // highestIndex = selectedItems.indexOf(max);
        // console.log(max,max.finalPrice);
        return max;
        // return items[maxIndex];
	}

	function getMin(searchKey) {

	    if (typeof (selectedItems) === 'undefined' || typeof (searchKey) === 'undefined' || selectedItems.length === 0) {
	        return 0;
	    }

	    var minPrice = selectedItems[0][searchKey];
	    var min = selectedItems[0];
	    selectedItems.forEach(function(auction) {

	        if (auction[searchKey] < minPrice) {
	            minPrice = auction[searchKey];
	            min = auction;
	        }
	    });

	    return min;
    }

    function getMinMaxHTML(minMax) {

    	if (minMax === 0) {
    		return minMax;
    	}

    	else {
    		var returnHTML = "";
    		returnHTML = "<a href=#"+newItems.indexOf(minMax)+">$" + minMax.finalPrice + "</span>"
    		return returnHTML;
    	}
    }


	var max = getMax("finalPrice");
	var min = getMin("finalPrice");

	var maxHTML = getMinMaxHTML(max);
	var minHTML = getMinMaxHTML(min);


	$('#selectedMax').html(maxHTML);
	$('#selectedMin').html(minHTML);

	$('#selectedItemNum').html(selectedItems.length + " item(s)");
	$('#selectedAvg').html("$"+calcAvg("price"));
	$('#selectedShipped').html("$"+calcAvg("finalPrice"));
}