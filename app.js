var express = require("express");
//var mongo = require('mongodb');
var request = require("request");
var bodyParser = require("body-parser");
var colors = require("colors");

//var MongoClient = mongo.MongoClient;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var appID = "chulahnc0-347f-40b2-8df7-372d69c4c7e";

Date.prototype.getDateString = function() {
  return (
    this.getMonth() + 1 + "/" + this.getDate() + "/" + (this.getYear() - 100)
  );
};

Date.prototype.getTime = function() {
  return this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};

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

app.get("/", function(req, res) {
  res.sendfile("index.html");
});

function buildRequestURL(params) {
  console.log(params);

	/*
		http://developer.ebay.com/Devzone/finding/CallRef/findItemsAdvanced.html
	    url += "&sortOrder=EndTimeSoonest";
		
		sortorder takes
		BestMatch - default x

		BidCountFewest
		BidCountMost
		
		CurrentPriceHighest
		DistanceNearest - must include buyerPostalCode &buyerPostalCode=
		EndTimeSoonest x
		PricePlusShippingLowest x
		PricePlusShippingHighest x
		StartTimeNewest // find completed items

    */

  var appID = "chulahnc0-347f-40b2-8df7-372d69c4c7e";

  var url = "http://svcs.ebay.com/services/search/FindingService/v1";
  url += "?OPERATION-NAME=" + params.requestType;
  // url += "?OPERATION-NAME=findItemsByKeywords";
  url += "&SERVICE-VERSION=1.0.0";
  url += "&SECURITY-APPNAME=" + appID;
  url += "&GLOBAL-ID=EBAY-US";
  url += "&RESPONSE-DATA-FORMAT=JSON";
  // url += "&callback=_cb_findItemsByKeywords";
  url += "&REST-PAYLOAD";
  url += "&keywords=" + params.keyword;
  url += "&paginationInput.entriesPerPage=100"; //1-100
  // url += "&paginationInput.pageNumber=10";  //1-100
  url += "&sortOrder=" + params.sortBy;

  if (params.searchDesc === "on") {
    url += "&descriptionSearch=true";
  }

  return url;
}

app.post("/search/", function(req, res) {
  var requestURL = buildRequestURL(req.body);

  console.log(req.body);

  request(requestURL, function(err, response, body) {
    if (!err) {
      var result = body;
			result = JSON.parse(result);
			/*
				{ findCompletedItemsResponse:
   				[ { ack: [Array],
      			 version: [Array],
       			 timestamp: [Array],
      			 searchResult: [Array],
      			 paginationOutput: [Array] } ] }
			*/

      var responseName = "";

      for (response in result) {
        // console.log(response);
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

					{ pageNumber: [ '1' ],
  					entriesPerPage: [ '100' ],
 						totalPages: [ '1' ],
  					totalEntries: [ '70' ] }
				*/

        var items = result.searchResult[0].item;

        if (items === undefined) {
          return res.send("0 results");
        }

				/*
					{ itemId: [ '323470788237' ],
						title:
						[ 'Adidas Yeezy Boost 350 V2 Triple White CP9366  Size: 9.5 CONFIRMED PREORDER' ],
						globalId: [ 'EBAY-US' ],
						primaryCategory: [ { categoryId: [Array], categoryName: [Array] } ],
						galleryURL:
						[ 'http://thumbs2.ebaystatic.com/m/mwn7hR-j-nu_pKtd-j_8pnw/140.jpg' ],
						viewItemURL:
						[ 'http://www.ebay.com/itm/Adidas-Yeezy-Boost-350-V2-Triple-White-CP9366-Size-9-5-CONFIRMED-PREORDER-/323470788237' ],
						productId: [ { '@type': 'ReferenceID', __value__: '937394446' } ],
						paymentMethod: [ 'PayPal' ],
						autoPay: [ 'true' ],
						postalCode: [ '91755' ],
						location: [ 'Monterey Park,CA,USA' ],
						country: [ 'US' ],
						shippingInfo:
						[ { shippingServiceCost: [Array],
								shippingType: [Array],
								shipToLocations: [Array],
								expeditedShipping: [Array],
								oneDayShippingAvailable: [Array],
								handlingTime: [Array] } ],
						sellingStatus:
						[ { currentPrice: [Array],
								convertedCurrentPrice: [Array],
								sellingState: [Array] } ],
						listingInfo:
						[ { bestOfferEnabled: [Array],
								buyItNowAvailable: [Array],
								startTime: [Array],
								endTime: [Array],
								listingType: [Array],
								gift: [Array] } ],
						returnsAccepted: [ 'false' ],
						condition: [ { conditionId: [Array], conditionDisplayName: [Array] } ],
						isMultiVariationListing: [ 'false' ],
						topRatedListing: [ 'false' ] }
				*/

        var newItems = items.map(function(item) {
          var itemDetails = {
            id: item.itemId[0],
            img: (item.galleryURL && item.galleryURL[0]) || "../no_image.jpg",
            url: item.viewItemURL[0],
            title: item.title[0],
            conditionID:
              (item.condition &&
                item.condition[0] &&
                item.condition[0].conditionId[0]) ||
              "No Condition Listed",
            condition:
              (item.condition &&
                item.condition[0] &&
                item.condition[0].conditionDisplayName[0]) ||
              "No Condition listed",

            country: item.country && item.country[0],
            location: item.location[0],

            startTime: item.listingInfo[0].startTime[0],
            endTime: item.listingInfo[0].endTime[0],

            status: item.sellingStatus[0].sellingState[0],

            price: parseFloat(
              item.sellingStatus[0].convertedCurrentPrice[0].__value__
            ),
            shipping:
              parseFloat(
                item.shippingInfo[0] &&
                  item.shippingInfo[0].shippingServiceCost &&
                  item.shippingInfo[0].shippingServiceCost[0].__value__
              ) || "Free"
          };

          if (item.shippingInfo[0].shippingType[0] === "Calculated") {
            itemDetails.shipping = "Calculated";
          }
          itemDetails.shortCondID = itemDetails.conditionID[0];

          itemDetails.finalPrice = parseFloat(
            (
              itemDetails.price + (parseFloat(itemDetails.shipping) || 0)
            ).toFixed(2)
          );

          return itemDetails;
        });

        res.render("results.ejs", {
          ejs_items: items,
          ejs_newItems: newItems,
          ejs_searchParams: req.body,
          ejs_reqURL: requestURL,
          ejs_pagination: paginationOutput
        });
      }
    }
  });
});

app.get("/scripts/script.js", function(req, res) {
  res.sendfile("scripts/script.js");
});
app.get("/scripts/controller.js", function(req, res) {
  res.sendfile("scripts/controller.js");
});
app.get("/scripts/d3viz.js", function(req, res) {
  res.sendfile("scripts/d3viz.js");
});
app.get("/styles/style.css", function(req, res) {
  res.sendfile("styles/style.css");
});
app.get("/styles/style.less", function(req, res) {
  res.sendfile("styles/style.less");
});
app.get("/styles/index.css", function(req, res) {
  res.sendfile("styles/index.css");
});
app.get("/styles/index.less", function(req, res) {
  res.sendfile("styles/index.less");
});

app.get("/no_image.jpg", function(req, res) {
  res.sendfile("no_image.jpg");
});

app.listen(process.env.PORT || 3000);
