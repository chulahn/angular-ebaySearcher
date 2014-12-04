var express = require('express');
var mongo = require('mongodb');
var request = require('request');
var bodyParser = require('body-parser');
var colors = require('colors');

var MongoClient = mongo.MongoClient;


var app = express();
app.use(bodyParser.urlencoded({ extended: false }));


var appID = "chulahnc0-347f-40b2-8df7-372d69c4c7e";


Date.prototype.getDateString = function() {
	return this.getMonth()+1 + "/" + this.getDate() + "/" + (this.getYear()-100)
}

Date.prototype.getTime = function() {
	return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds()
}


/* Sandbox Keys
	DEVID:
	8ee23631-1214-4c86-960e-cf8caa6d4233
	AppID:
	chulahn2a-c015-4b27-a355-c14f49e7e98
	CertID:
	9b378b75-26ad-4f69-9e5a-3c51c7f79a93
*/

/* Production Keys
	DEVID:
	8ee23631-1214-4c86-960e-cf8caa6d4233
	AppID:
	chulahnc0-347f-40b2-8df7-372d69c4c7e
	CertID:
	3dd9e415-0328-4847-96b7-a40494af2e4b
*/
var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME="+appID;
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    url += "&callback=_cb_findItemsByKeywords";
    url += "&REST-PAYLOAD";
    url += "&keywords=harry%20potter";
    url += "&paginationInput.entriesPerPage=10";  //1-100
    // url += "&paginationInput.pageNumber=10";  //1-100



    /*
		sortorder takes
		BestMatch - default

		BidCountFewest
		BidCountMost
		
		CurrentPriceHighest
		DistanceNearest - must include buyerPostalCode &buyerPostalCode=
		EndTimeSoonest
		PricePlusShippingLowest
		PricePlusShippingHighest

    */


    url += "&sortOrder=EndTimeSoonest";

app.get('/' , function (req,res) {

	res.sendfile('index.html')
	
});

function buildRequestURL(params) {

	var appID = "chulahnc0-347f-40b2-8df7-372d69c4c7e";

	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
    url += "?OPERATION-NAME="+params.requestType;
    // url += "?OPERATION-NAME=findItemsByKeywords";
    url += "&SERVICE-VERSION=1.0.0";
    url += "&SECURITY-APPNAME="+appID;
    url += "&GLOBAL-ID=EBAY-US";
    url += "&RESPONSE-DATA-FORMAT=JSON";
    // url += "&callback=_cb_findItemsByKeywords";
    url += "&REST-PAYLOAD";
    url += "&keywords=" + params.keyword;
    url += "&paginationInput.entriesPerPage=100";  //1-100
    // url += "&paginationInput.pageNumber=10";  //1-100
    url += "&sortOrder=" + params.sort;

    return url;
}



app.post('/get/', function(req,res) {

	var requestURL = buildRequestURL(req.body);

	// console.log(colors.red(requestURL));


	request(requestURL, function(err, response, body) {
		if (!err) {
			console.log(colors.green(body));
			var result = body;
			result = JSON.parse(result);

			var responseName = "";
			for (response in result) {
				responseName = response;
			}
			result = result[responseName][0];

			var success = result.ack[0];

			if (success === "Success" || success === "Warning") {

				// console.log(result);

				var paginationOutput = result.paginationOutput[0];
				/*
					.pageNumber[0] = numPages
					.entriesPerPage[0]
					.totalPages[0] = 7
					.totalEntries[0] = 619
				*/
				// console.log(paginationOutput);

				var items = result.searchResult[0].item;

				console.log(items);

				var newItems = items.map(function(item) {
					console.log(colors.blue(item.galleryURL[0]))

					var itemDetails = {
						id: item.itemId[0],
						img : item.galleryURL[0],
						url : item.viewItemURL[0],
						title : item.title[0],
						conditionID : (item.condition && item.condition[0] && item.condition[0].conditionId[0]) || "No Condition Listed",
						condition : (item.condition && item.condition[0] && item.condition[0].conditionDisplayName[0]) || "No Condition listed",

						country : (item.country && item.country[0]),
						location: item.location[0],

						startTime : {date : new Date(item.listingInfo[0].startTime[0])},
						endTime : {date : new Date(item.listingInfo[0].endTime[0])},

						status : item.sellingStatus[0].sellingState[0],

						price : parseFloat(item.sellingStatus[0].convertedCurrentPrice[0].__value__),
						shipping : parseFloat(item.shippingInfo[0] && item.shippingInfo[0].shippingServiceCost &&  item.shippingInfo[0].shippingServiceCost[0].__value__) || "Free"
					}

					if (item.shippingInfo[0].shippingType[0] === "Calculated") {
						itemDetails.shipping = "Calculated";
					}
					itemDetails.shortCondID = itemDetails.conditionID[0];

					itemDetails.finalPrice = parseFloat((itemDetails.price + (parseFloat(itemDetails.shipping) || 0)).toFixed(2));

					itemDetails.startTime.str = itemDetails.startTime.date.getDateString() + " " + itemDetails.startTime.date.getTime();
					itemDetails.endTime.str = itemDetails.endTime.date.getDateString() + " " + itemDetails.endTime.date.getTime();

					return itemDetails;

				});

				res.render("results.ejs" , {ejs_items: items, ejs_newItems: newItems, ejs_reqURL: requestURL, ejs_pagination: paginationOutput});


			}

		}
		// console.log(response)


		

	});

});

app.get('/scripts/script.js', function (req,res) {
	res.sendfile('scripts/script.js');
});

app.get('/styles/style.css', function (req,res) {
	res.sendfile('styles/style.css');
});
app.get('/styles/style.less', function (req,res) {
	res.sendfile('styles/style.less');
});


app.get('/controller.js', function (req,res) {
	res.sendfile('controller.js');
});






app.listen(3000);