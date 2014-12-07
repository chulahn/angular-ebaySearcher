var selectedItems = [];
var selectedMin = selectedItems[0];
var selectedMax = selectedItems[0];

$(document).ready(function() {



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

		console.log(currentItem.id);

		if (currentRow.hasClass('highlighted')) {
			selectedItems.push(currentItem);
		}

		else {
			console.log("removed from index ", removeIndex)
			var removeIndex = selectedItems.indexOf(currentItem);
			selectedItems.splice(removeIndex,1);
		}

		updateSelectedDataDiv();
		console.log(selectedItems);
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
        console.log(max,max.finalPrice);
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




//Old JQuery Way of creating table
function getResultsForPage(pageNum) {
	var tableDataHTML = "<form>";

	var start = pageNum * 10;
	var end = start + 10;

	items.slice(start,end).forEach(function (item) {
		tableDataHTML += "<tr>";
		/*
			currentPrice = []
			convertedCurrentPrice = []
			sellingState = []
			timeLeft = []
		*/
		var image = item.galleryURL[0];
		var link = item.viewItemURL[0];
		var title = item.title[0];
		var itemID = item.itemId[0];
		var sellingStatus = item.sellingStatus[0];

		var price = sellingStatus.currentPrice[0].__value__;
		var shipping = item.shippingInfo[0];
		var shippingPrice = (shipping.shippingServiceCost && parseFloat(shipping.shippingServiceCost[0].__value__).toFixed(2)) || "Free";
		var finalPrice = parseFloat(price) + (parseFloat(shippingPrice) || 0);

		var currency = sellingStatus.currentPrice[0]['@currencyId'];
		var convertedCurr = sellingStatus.convertedCurrentPrice[0]['@currencyId'];
		var convertedPrice = sellingStatus.convertedCurrentPrice[0].__value__;

		var finalConvertedPrice = parseFloat(convertedPrice) + (parseFloat(shippingPrice) || 0);

		var listingInfo = item.listingInfo[0];
		var startTime = listingInfo.startTime[0];
		startTime = new Date(startTime);
		var endTime = listingInfo.endTime[0]
		endTime = new Date(endTime);

		tableDataHTML += "<td><img src="+image+"></img></td>";
		tableDataHTML += "<td><a href="+link+">"+title+"</a></td>";

		tableDataHTML += "<td>"+itemID+"<input type=\"checkbox\" name="+items.indexOf(item)+"></input></td>";

		tableDataHTML += "<td>Price: " + parseFloat(convertedPrice).toFixed(2)+"<br/>";
		tableDataHTML += "Shipping Cost: " + shippingPrice + "<br/>";
		tableDataHTML += "<span class = \"shipped\">Price + Shipping: " + getCurrencySymbol(convertedCurr) + parseFloat(finalConvertedPrice).toFixed(2) + "</span><br/>";

		if (sellingStatus.sellingState[0] === "EndedWithoutSales") {
			tableDataHTML += "<span class = \" nosale \">ENDED WITHOUT SALE</span>";
			console.log($(this));
		}
		tableDataHTML += "</td>"
		tableDataHTML += "<td>" + endTime.getDateString() + " " + endTime.getTime() + "</td>";
		tableDataHTML += "</tr>";
	});

	tableDataHTML += "</form></table>";
	$('#searchResults').html(tableTopHTML + tableDataHTML);
}