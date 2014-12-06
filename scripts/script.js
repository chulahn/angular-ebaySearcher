var tableTopHTML = "<table><tr><th>Image</th><th>Title</th><th>ID</th><th>Price</th><th>End Date</th></tr>";
var selectedItems = [];
var selectedMin = selectedItems[0];
var selectedMax = selectedItems[0];

Date.prototype.getDateString = function() {
	return this.getMonth()+1 + "/" + this.getDate() + "/" + (this.getYear()-100)
}

Date.prototype.getTime = function() {
	return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds()
}

$(document).ready(function() {

	/*item has
		itemId
		title
		globalId = ebayus
		sellingStatus = array[0] w. currentPrice, convertedCurrentPrice, sellingState
	*/
	$('#searchResult').on('click', 'input[type="checkbox"]', function() {
		var arrayIndex = parseInt($(this).attr('id'));

		var items = angular.element($('[ng-controller=dataController')).scope().items;
		var currentItem = items[arrayIndex];
		currentItem.index = items.indexOf(currentItem);

		var currentRow = $(this).parent().parent();
		currentRow.toggleClass('highlighted');
		console.log(currentItem.id);
		if (currentRow.hasClass('highlighted')) {
			selectedItems.push(currentItem);
		}
		else {
			console.log("removed")
			var removeIndex = selectedItems.indexOf(currentItem);
			console.log(removeIndex);
			selectedItems.splice(removeIndex,1);
		}
		updateSelectedData();
		console.log(selectedItems);

	});

/*
	console.log(items[0]);

	getResultsForPage(0);

	var navHTML = "<h2>";
	for (var i=0; i<items.length/10; i++){
		if (i === 0) {
			navHTML += "<span class=\"selected\">";
		}
		else {
			navHTML += "<span>"
		}
		navHTML += (i+1);
		navHTML += "</span>  ";
	}
	navHTML += "</h2>";

	navHTML += "<span id=\"moreResults\">Click For More Results</span>";

	$('nav').html(navHTML);
	$('nav').prepend("<h1>"+items.length+"</h1>");

	$('nav span').click(function(){

		var arrayIndex = $(this).html();
		$('.selected').removeClass('selected');
		$(this).toggleClass('selected');

		console.log($(this).html());

		getResultsForPage(arrayIndex-1);

	});


*/

	$('#addItems').click(function() {
		console.log(123);
		$('input[type="checkbox"]').each(function() {
			console.log($(this).prop('checked'));
			if ($(this).prop('checked') === true) {
				$(this).parent().removeClass();
				$(this).parent().addClass('added');
				console.log("added classes")
			}
			// $(this).
		})
	});
});

function updateSelectedData() {


	function getSumFor(param) {
		if (selectedItems.length !== 0) {
			if (selectedItems.length === 1) {
				return selectedItems[0][param];
			}
			var total = selectedItems.reduce(function (total, current) {
						return (parseFloat(total[param] || total || 0) + parseFloat(current[param]));
						});
			return total;
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
	$('#selectedAvg').html("$"+getSumFor("price"));
	$('#selectedShipped').html("$"+getSumFor("finalPrice"));
}

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

function getAveragePrice(items) {
	
	var totalPrice = 0;
	var priceRange = [];

	items.forEach(function (item) {
		var sellingStatus = item.sellingStatus[0];
		var convertedPrice = sellingStatus.convertedCurrentPrice[0].__value__;
		var shippingPrice = (shipping.shippingServiceCost && parseFloat(shipping.shippingServiceCost[0].__value__).toFixed(2)) || "Free";
		var finalConvertedPrice = parseFloat(convertedPrice) + (parseFloat(shippingPrice) || 0);
		totalPrice += finalConvertedPrice;
		
		priceRange = (finalConvertedPrice / 0).toFixed(0);

	});

	return (totalPrice / items.length).toFixed(2);
}
