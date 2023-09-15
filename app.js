var express = require("express");
//var mongo = require('mongodb');
var request = require("request");
var bodyParser = require("body-parser");
var colors = require("colors");

//var MongoClient = mongo.MongoClient;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var appID = "chulahnc0-347f-40b2-8df7-372d69c4c7e";
appID = "ChulAhn-average-SBX-4727b8eb0-b8e029c1";
var accessT = "v^1.1#i^1#I^3#r^0#f^0#p^1#t^H4sIAAAAAAAAAOVYW2wUVRju9gakFAISJIqwjiZFyM6emdnuZeyubm+0XHZrdy3QpMDM7Jnu2NmZcc4Z2o2NKRVL1FQtSmK0Kj5wiSRWvACCPIgRQYgPRrHy4BUD6gMEQ+CBqGd2S2krgUI3sYn7sJNzzv//5/+/89/OAV3F0xb31PVcKnVMyd/WBbryHQ6mBEwrLloyoyD/rqI8MILAsa3r/q7C7oKzFUhIqQbfCJGhawg6O1KqhvjMZJCyTI3XBaQgXhNSEPFY4mPhlSt4lga8YepYl3SVctZXBymGYz0+BpRLfiB7gTdBZrWrMuN6kJJ8nM/H+v1+r1cCnMiQdYQsWK8hLGg4SLGA5Vwg4GI8cZblOR/PMrTH52+mnE3QRIquERIaUKGMunyG1xyh641VFRCCJiZCqFB9uDYWDddX10TiFe4RskJDOMSwgC00elSlJ6CzSVAteONtUIaaj1mSBBGi3KHsDqOF8uGrytyG+hmoIesXCJYi4/NxUGaFnEBZq5spAd9YD3tGSbjkDCkPNazg9M0QJWiIj0EJD40iRER9tdP+PGIJqiIr0AxSNZXhNeGGBipUlbTUcFJzCRugKbRCV6xytcvjY32iH4rARf4BG5CYoW2ysoZAHrNPla4lFBsy5IzouBISneFYZNgRyBCiqBY1wzK29RmmK48DMIwg12wfafYMLZzU7FOFKQKDMzO8Of7D3BibimhhOCxh7EIGoCAlGIaSoMYuZjxxyHk6UJBKYmzwbnd7ezvdztG62epmAWDcq1euiElJmCL+YdPasW7TKzdncCkZUyRIOJHC47RBdOkgnkoU0FqpkAcEgI8bwn20WqGxs/+aGGGze3Q85Cw+xABXDmQWyhBAxi/mIj5CQy7qtvWAopB2pQSzDWJDFSTokoifWSloKgmeK5dZzi9DV8IbkF2egCy7xPKE18XIkGgDRVEK+P8/YTJeR49ByYQ4R56eIy+vra1J40quPRldtVSpI/nNC9Dy6LLax5N6G2NEGlYuZ5WljW265gsHxxsL1zW+SlUIMnGyf64AsGM9NyDU6QjDxITMi0m6ARt0VZHSk+uAOTPRIJg4XWmlyTgGVZV8JmRq2DDqc5Wvc2TkLaWK27M6l1XqP6lQ17UK2W47uayy+RERIBgKbdcgWtJTbjvWdYE0IPb0uozWzusSjiFyi1aabrUgwkSTBOkAx82kkFROk3KWGD9LtlgSI8bPQq4XCUvCt7VRpirTBE2lNYnRLe3ZMRFQREttGz9LAgrqhFxUIZeMSeWgxNKsyUoiezugM3bTaINEmxDplkkuRnTUbpfjehvUSPuBTV1Vodk0sRRkJ95UysKCqMLJloFzkIsUIdsbFXY7zk8auxhvgDR7DPBM7OikTPezbrJVkNzWzVu4A7lHv8eE8jI/pttxCHQ7Psp3OIAPuJgl4IHigkcLC6ZTiGQeGglaQtQ7aEWQaZL0NAFbJqTbYNoQFDO/2KGc+lq6POIlaFsLmDf8FjStgCkZ8TAE5l9bKWJm3lnKciDAeFiW87FMM7jv2mohM7dwTnMULRh4KHL4YntZ6qkf9tzT3nf3LlA6TORwFOURt83r/Kmv7MzgV9v3JPfNa3itZiDKzy0KS1+mfl+8a5A///T2z52ImeWNXDYPbpQXXolcOv3K/CcCXY6tm/i93NG1Ty7E630x+G7Ppk9Wzeic+vKlA8vKLsye9ee9FZH1nceOnPyjdqCl08u92lr6QtOZfcVNp3a/wVd8+OOcvr1v/tZ7Nv/K0cbK/QsOfvbON3hV/XfzHj6x+VAaPP/p27Of/fnbnv7vX2ou/avXsfPk6YvHF8ndfSVfDHwwNcxSD7YcOffi/F93HI4XbFwwUHegt1CPnJi5uXFW0ZT+vi1l7+0w+qcfuzAYP//6M8/t3P/3FIPfsmbR4LniyPGt/Me/vD/QEr5jbXV/71sl2oZju7PH+A8WrlSJoxMAAA==";
accessT = "v^1.1#i^1#I^3#r^0#f^0#p^1#t^H4sIAAAAAAAAAOVYa2wURRzv9QUFq4mUR7ChlwUTkeze7N6ru/QuuT6p0F7hauWlsI/Z3nJ7u+fOLO2BJqXYiiFB4zso2mAkkhgDCR80hsQPConhYQxGFJFEUeCDipEENASd3SvlWgkUeolNvA+3mZn/8zf/x8yAvvKKhweXDF6u9EwpHuoDfcUeDzsdVJSXLbq3pHhuWRHII/AM9S3oK+0vOV+HxLSeEVZAlDENBL29ad1AgjsZoWzLEEwRaUgwxDREApaFRKxtmcAxQMhYJjZlU6e8rY0RSpEkVYRsAPhrAQxIHJk1rsvsNCNUiIeQUyAb5Hk1CAISWUfIhq0GwqKBIxQHOD8NeJoNdgIgBHkhwDIAsKspbxe0kGYahIQBVNQ1V3B5rTxbb22qiBC0MBFCRVtjzYl4rLWxqb2zzpcnKzqMQwKL2EajRw2mAr1dom7DW6tBLrWQsGUZIkT5ojkNo4UKsevG3IX5LtQhOSxzfCgUCoRUlgsFCwJls2mlRXxrO5wZTaFVl1SABtZw9naIEjSkDVDGw6N2IqK10et8ltuirqkatCJUU31sVayjg4o2JG09ljRocSO0xG5IJ+pX0oEwF5ZqoQRo8g84XmaH1eRkDYM8Rk+DaSiaAxnytpu4HhKb4VhkAnnIEKK4EbdiKnbsyafjXAQBw/Ph1c6W5vbQxknD2VWYJjB43eHt8R/hxtjSJBvDEQljF1yAIpSYyWgKNXbRjcTh4OlFESqJcUbw+Xp6epgeP2Na3T6OqPOtbFuWkJMwLVIurZPrDr12ewZac12RIeFEmoCzGWJLL4lUYoDRTUUDgAdh/zDuo82Kjp3910Sez77R+VCo/OBEniV1JsyqiqL4ebkQ+REdDlGfYweUxCydFq0UxBldlCEtkziz09DSFMEfVDl/rQppJcSrdIBXVVoKKiGaVSEEEEqSzNf+f9JkvIGegLIFcYEivUBR3tzclMX1/p5k/LEWbQmpbyGAlsYfaX4yaabYTHtH21JOa1mRMo1wLDLeXLip8w26RpDpJPoLBYCT64UBYYmJMFQm5F5CNjOww9Q1OTu5NthvKR2ihbP1dpaME1DXyWdCrsYymdZC1esCOXlHpeLuvC5kl/pPOtRNvUJO2E4urxx+RASIGY1xehAjm2mfk+umSA4gzvQ612rvTQnHEPkkO8t02xBhYolCToDjZtJIKWdIO1PGz5JrlsSJ8bOQ64Viy/iuFLldmSFoat1JjO5IZ+9EQJFsPTV+FgWK+oRCVCOXjEkVoMTTnMuakrsdMK7fDNooMxZEpm2RixETd47LnWYKGuT4gS1T16HVNbES5BTedNrGoqTDyVaBC1CLNDF3Nirt91ycNH6xIT4Q9vPBWjAh32T39LNusnWQwvbNO7gD+Ua/x0SL3B/b7zkI+j0fFXs8IAxodhFYWF7yaGnJPRQilYdBoqFIZi+jiSpDip4hYtuCTApmM6JmFZd7tG9PyFfyXoKGHgdzRt6CKkrY6XkPQ6D6xkoZe9/sSs4PeDYIQJAPsKvB/Burpeys0qp9O6tb4rPsfdeOb2IOvrf30pVQYABUjhB5PGVFJGyL+juf3TXjgZqVhy7MfaK5TvXVPpjatunVqVv6Fnb9MWR3XPthakA/Ur37Q+aFh67wlTVbvnlqzakzU9oG2B1HW9rmdG6omh/ZdvHApv7ni9bMnFFzIrp9bbrj6Uix+cbZmh3Tjp47sl7ZH/tkb/zcOy827apmG97+8oPWWOWe+w/hI98fXry/UihbsZmiuk4N/hixn/n86607e49W1e9sWp8c3PP3tL820Kcb311bg+pmL/hs+5+Jxa8c56R5y3/6ePOvC36+Go+drWr0HmvwPRc8dxVIL6/aMfBm9ovXmk4eiO4uer/nl6FPL9Qd/v31t1rmBX77buvA+cuhfRWnvjp9cebQotKXzpzv7zp57NL6/blt/AdSQa8ZoxMAAA==";

Date.prototype.getDateString = function () {
  return (
    this.getMonth() + 1 + "/" + this.getDate() + "/" + (this.getYear() - 100)
  );
};

Date.prototype.getTime = function () {
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

app.get("/", function (req, res) {
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
  appID = "ChulAhn-average-SBX-4727b8eb0-b8e029c1";

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

function b2(params) {
  var test = "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q="
  test += params.keyword

  return test;
}

app.post("/search/", function (req, res) {
  var requestURL = buildRequestURL(req.body);
  requestURL = b2(req.body);

  console.log(requestURL)

  var headers = {
    'Authorization': `Bearer ${accessT}`,
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>',
  }
  
  var options = {
    url: requestURL,
    headers: headers,
  }

  console.log('req.body',req.body);


  request(options, function (err, response, body) {
    if (!err) {
      var result = body;
      result = JSON.parse(result);
      console.log(result);
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

      console.log("result", result);

        var items = result.itemSummaries;

        console.log(items);

        if (items === undefined) {
          return res.send("0 results");
        }

        /*

         {
          itemId: 'v1|110554334980|0',
          title: "New Balance Women's FuelCore Nergize Sport V1 Sneaker, Garnet/Pink Glo, 8",
          leafCategoryIds: [Array],
          categories: [Array],
          price: [Object],
          itemHref: 'https://api.sandbox.ebay.com/buy/browse/v1/item/v1%7C110554334980%7C0',
          seller: [Object],
          condition: 'New with box',
          conditionId: '1000',
          shippingOptions: [Array],
          buyingOptions: [Array],
          itemAffiliateWebUrl: 'http://www.sandbox.ebay.com/itm/New-Balance-Womens-FuelCore-Nergize-Sport-V1-Sneaker-Garnet-Pink-Glo-8-/110554334980?hash=item19bd8d4704%3Ai%3A110554334980&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=%253CePNCampaignId%253E&customid=%253CreferenceId%253E&toolid=10049',
          itemWebUrl: 'http://www.sandbox.ebay.com/itm/New-Balance-Womens-FuelCore-Nergize-Sport-V1-Sneaker-Garnet-Pink-Glo-8-/110554334980?hash=item19bd8d4704:i:110554334980',
          itemLocation: [Object],
          adultOnly: false,
          legacyItemId: '110554334980',
          availableCoupons: false,
          itemCreationDate: '2023-08-31T17:04:12.000Z',
          topRatedBuyingExperience: false,
          priorityListing: false,
          listingMarketplaceId: 'EBAY_US'
        },


        */
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

        var newItems = items.map(function (item) {
          var itemDetails = {
            id: item.itemId,
            img: (item.galleryURL && item.galleryURL[0]) || "../no_image.jpg",
            url: item.itemWebUrl,
            title: item.title,
            conditionID:
              (item.condition) ||
              "No Condition Listed",
            condition:
              (item.condition) ||
              "No Condition listed",

            location: item.location,

            startTime: new Date(item.itemCreationDate),
            // endTime: item.listingInfo[0].endTime[0],

            // status: item.sellingStatus[0].sellingState[0],

            price: item.price,
            shipping: item.shippingOptions
              
          };

          // if (item.shippingInfo[0].shippingType[0] === "Calculated") {
          //   itemDetails.shipping = "Calculated";
          // }
          // itemDetails.shortCondID = itemDetails.conditionID[0];

          // itemDetails.finalPrice = parseFloat(
          //   (
          //     itemDetails.price + (parseFloat(itemDetails.shipping) || 0)
          //   ).toFixed(2)
          // );

          return itemDetails;
        });

        res.render("results.ejs", {
          ejs_items: items,
          ejs_newItems: newItems,
          ejs_searchParams: req.body,
          ejs_reqURL: requestURL,
          ejs_pagination: 1,
        });
      
    }
  });
});

app.get("/scripts/script.js", function (req, res) {
  res.sendfile("scripts/script.js");
});
app.get("/scripts/controller.js", function (req, res) {
  res.sendfile("scripts/controller.js");
});
app.get("/scripts/d3viz.js", function (req, res) {
  res.sendfile("scripts/d3viz.js");
});
app.get("/styles/style.css", function (req, res) {
  res.sendfile("styles/style.css");
});
app.get("/styles/style.less", function (req, res) {
  res.sendfile("styles/style.less");
});
app.get("/styles/index.css", function (req, res) {
  res.sendfile("styles/index.css");
});
app.get("/styles/index.less", function (req, res) {
  res.sendfile("styles/index.less");
});

app.get("/no_image.jpg", function (req, res) {
  res.sendfile("no_image.jpg");
});

app.listen(process.env.PORT || 3000);
