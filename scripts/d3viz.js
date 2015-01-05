var d3Globals = {}
d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
d3Globals.padding = {"x": 40 , "y": 20};
d3Globals.small = false;

d3Globals.tip = d3.tip().attr('class', 'd3-tip')
					.html(function(d) {

						var dateString = new Date(d.endTime.str);
						var price = d.price;
						var shipped = d.finalPrice;

						var output = dateString.toLocaleString() + "</br>" + 
									"Price: " + price + "<br/>" + 
									"After Shipping: " + shipped;

						return output;
					});

$(document).ready(function() {

	d3.select(window).on('resize', updateAxes);

	drawViz();
	setDatePlaceHolder();
	//price
	$('#filterDiv input[type="number"]').on('keyup', function() {
		updateViz();
		setTimeout(cleanGraph, 1000);
		setDatePlaceHolder();
	});

	$('#searchFilter').on('keyup', function() {
		updateViz();
		setTimeout(cleanGraph, 1000);
		setDatePlaceHolder();
	});

	//buttons
	$('#filterDiv input[type="checkbox"]').on('change', function() {
		setTimeout(updateViz, 100);
		setDatePlaceHolder();
	});

	function setDatePlaceHolder() {

		var earlyPlaceHold = d3Globals.earliestDate.getInputString();
		var latePlaceHold = d3Globals.latestDate.getInputString();
		$('#earliestDateFilter').val(earlyPlaceHold);
		$('#earliestDateFilter').prop('min', earlyPlaceHold);
		$('#earliestDateFilter').prop('max', latePlaceHold);

		$('#latestDateFilter').val(latePlaceHold);
		$('#latestDateFilter').prop('min', earlyPlaceHold);
		$('#latestDateFilter').prop('max', latePlaceHold);

	}
});

/*
	Adds datapoints to svg.  Briefly shows a big green circle then animates to a small black one.
	Each circle has a mouseover event, and a link to the anchor in the table.
	Called in updateViz(), drawViz().
*/
function addDataPoints() {

	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
	var xScale = d3Globals.xScale;
	var yScale = d3Globals.yScale;
	var tip = d3Globals.tip;

	d3Globals.svg.call(tip);

	circles = d3Globals.svg.selectAll('circle');

	d3Globals.svg.selectAll('circle')
		.data(data)
		.enter()
		.append('a').attr('xlink:href', function(d) {
			return "#"+data.indexOf(d);
		})
		.append('circle')
		.attr('cx', function(d) {
			if (d3Globals.small === true) {

				var center = (d3Globals.dimens.w - d3Globals.padding.x) / 2;
				return center;
			}
			else {
				var currentDate = d.endTime.date.toDate();
				return xScale(currentDate);
			}
		})
		.attr('cy', function(d) {
			return yScale(d.finalPrice);
		})
		.attr('r', function(d) {
			return 7;
		})
		.attr('id', function(d) {
			return d.id;
		})
		.attr('fill-opacity', .6)
		.attr('fill', 'green')

		.on('mouseover', function(d) {
			console.log(d)
			// console.log(d3.select(this.parentNode).attr('href'))
			d3.select(this).transition().duration(500)
				.attr('r', 10)
				.attr('class', 'hover');
			tip.show(d)})
		.on('mouseout', function(d) {
			d3.select(this).transition().duration(500)
				.attr('r', 2)
				.attr('class', '');
			tip.hide(d)})

		.transition()
		.duration(1000)
		.attr('fill', 'black')
		.attr('fill-opacity' , 1)
		.attr('r', '2');	
}

function getAvgPrices() {
	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;

	var allPrices = d3Globals.allPrices = {};


	data.forEach(function(auction) {

		var endDate = auction.endTime.str.removeTime();

		if (allPrices[endDate] === undefined) {
			var firstPrice = [];
			firstPrice.push(auction.finalPrice);
			allPrices[endDate] = firstPrice;
		}
		else {
			allPrices[endDate].push(auction.finalPrice);
		}
	});

	for (date in allPrices) {

		if (allPrices.hasOwnProperty(date)) {
			var avgDatePrice = allPrices[date].getAvg();
			allPrices[date] = {num : allPrices[date].length , avgPrice : avgDatePrice};
		}
	}
}


/*
	If new points are being added, show old values by marking them red
	Else move without changing style
	Used in updateAxes() and updateViz()
*/
function moveOldPoints(addingNewData) {

	var scope = angular.element($('[ng-controller=dataController]')).scope();
	var data = scope.filteredItems;
	var circles = d3Globals.svg.selectAll('circle').data(data);
	var xScale = d3Globals.xScale;
	var yScale = d3Globals.yScale;

	circles
		.each(function(d) {
			
			var currentPoint = d3.select(this);
			var pNode = d3.select(this.parentNode);
			var currentDate = d.endTime.date.toDate();

			if (addingNewData !== undefined) {
				
				var currentX = parseInt(currentPoint.attr('cx'));
				var currentY = parseInt(currentPoint.attr('cy'));

				var newX = parseInt(xScale(currentDate));
				var newY = parseInt(yScale(d.finalPrice));

				if ((currentX !== newX) || (currentY !== newY)) {
					console.log("x " , currentX , newX, " y " , currentY , newY)

					currentPoint
						.transition()
						.duration(500)
							.attr('fill', 'yellow')
							.attr('r', '10')
							.attr('fill-opacity', .6)
							.attr('cx', function(d) {
								return xScale(currentDate);
							})
							.attr('cy', function(d) {
								return yScale(d.finalPrice);
							})
							.attr('id', function(d) {
								return d.id;
							})
						.transition()
						.duration(1000)
							.attr('fill', 'black')
							.attr('r', '2')
				}
			}
			else {
				currentPoint
					.transition()
					.duration(500)
						.attr('cx', function(d) {
							if (d3Globals.small === true) {
								var center = (d3Globals.dimens.w - d3Globals.padding.x) / 2;
								return center;
							}
							else {
								var currentDate = d.endTime.date.toDate()
								return xScale(currentDate);
							}
						})
						.attr('cy', function(d) {
							return yScale(d.finalPrice);
						})
						.attr('id', function(d) {
							return d.id;
						})
			}

			pNode
				.attr('href', function(d) {
					return "#"+newItems.indexOf(d);
				})
		})
}

/*
	Sets the graph's dimens, and scale/axes.
	Used in updateAxes(), and drawViz()
*/
function setGraphDimens(create) {
	var dimens = d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
	var padding = d3Globals.padding;

	var scope = angular.element($('[ng-controller=dataController]')).scope();	
	var data = scope.filteredItems;
	var minPrice = scope.minPrice;
	var maxPrice = scope.maxPrice;
	
	if (create) {
		var svg = d3Globals.svg = d3.select('#vizDiv').append('svg')
			.attr('width', dimens.w)
			.attr('height', dimens.h);
		svg.call(d3Globals.tip);
	}
	else {
		d3Globals.svg.attr('height', dimens.h).attr('width', dimens.w);
	}

	//used for setting up the axes.  sets in d3Global object
	function getMaxMins() {
		var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
		d3Globals.earliestDate = d3.min(data, function(d) { 
									var currentDate = d.endTime.date.toDate()
									return currentDate;
								});
		d3Globals.latestDate = d3.max(data, function(d) {
									var currentDate = d.endTime.date.toDate()
									return currentDate;
								});

		d3Globals.minPrice = d3.min(data, function(d) {return d.finalPrice;});
		d3Globals.maxPrice = d3.max(data, function(d) {return d.finalPrice;});
	}
	getMaxMins();

	//create scales and axes based on getMaxMins()
	function setScales() {
		var xScale = d3Globals.xScale = d3.time.scale()
						.domain([d3Globals.earliestDate, d3Globals.latestDate])
						.range([0 + padding.x, dimens.w - padding.x]) || d3Globals.xScale;

		var xAxis = d3Globals.xAxis = d3.svg.axis();
		xAxis.scale(xScale).orient('bottom').ticks(3);

		//if user did not input min, use 0.  no max, use highest price from data.
		var yScale = d3Globals.yScale = d3.scale.linear()
						.domain([minPrice || 0, maxPrice || d3Globals.maxPrice])
						.range([dimens.h - padding.y, padding.y]) || d3Globals.yScale;

		var yAxis = d3Globals.yAxis = d3.svg.axis();
		yAxis.scale(yScale).orient('left').ticks(5);
	}
	setScales();
}

/*
	Creates the inital visualization.
	Called on page load.
*/
function drawViz() {

	setGraphDimens("create");
	var svg = d3Globals.svg

	//adds axes
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + (d3Globals.dimens.h - d3Globals.padding.y) + ')')
		.call(d3Globals.xAxis);

	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(' + d3Globals.padding.x + ',0 )')
		.call(d3Globals.yAxis);
	
	//inside add data, if true, center points
	if (d3Globals.earliestDate.toString() === d3Globals.latestDate.toString()) {
		d3Globals.small = true;
	}
	//if only one tick mark, center tick
	if (d3.selectAll('.x g.tick')[0].length === 1) {
		d3.select('.x g.tick')
			.attr('fill', 'green')
			.attr('transform', 'translate(' + (d3Globals.dimens.w - d3Globals.padding.x) / 2 + ',' +  (0) + ')');
	}

	addDataPoints();
}

/*
	Adjusts axes, and moves data points.
	Used in updateViz().
*/
function updateAxes() {
	var scope = angular.element($('[ng-controller=dataController]')).scope();	
	var data = scope.filteredItems;

	setGraphDimens();
	
	//calculates avg price, std dev, range within 2 stddev
	function calcStats() {
		var stats = d3Globals.stats = {};

		var avg = stats.avg = data.getAvg();

		//calc std dev.
		var variance = 0;
		data.forEach(function(d) {
			var diff = (d.finalPrice - avg);
			diff *= diff;
			variance += diff;
		});

		stats.variance = variance /= data.length;
		var stddev = stats.stddev = Math.sqrt(variance);

		//get min and maxRange
		var minRange = stats.minRange = avg - (2*stddev);
		var maxRange = stats.maxRange = avg + (2*stddev);

		console.log("min range " , minRange , " avg " , avg , " max range " , maxRange);
	}
	calcStats();

	var svg = d3Globals.svg;

	//resizes axes
	if (data.length !== 0) {

		svg.select('.x.axis')
			.transition()
			.duration(1000)
			.attr('transform', 'translate(0,' + (d3Globals.dimens.h - d3Globals.padding.y) + ')')
			.call(d3Globals.xAxis);
		svg.select('.y.axis')
			.transition()
			.duration(1000)
			.attr('transform', 'translate(' + d3Globals.padding.x + ',0 )')
			.call(d3Globals.yAxis);	
	}

	moveOldPoints();
}

/*
	First calls updateAxes() to set new axes.
	Scale old points and remove any filtered points.
	Then adds new points and any missing points.
	Called when adding/filtering data or resizing. 
*/
function updateViz(addingNewData) {

	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
	updateAxes();
	var svg = d3Globals.svg;

	console.log("data size ", data.length)

	var circles = svg.selectAll('circle').data(data);
	var links = svg.selectAll('svg a').data(data);

	circles.exit()
		.transition().attr('r', 4).attr('fill', 'red')
		.transition().attr('r', 0).remove();
	links.exit().remove();
	
	(addingNewData === undefined) ? moveOldPoints() : moveOldPoints("addingNewData");

	//not only when adding data, but also when unfiltering
	addDataPoints();
	setTimeout(addMissing, 1000);

	function addMissing() {

		//circles that are shown
		var visible = $('svg circle:not([style *= "display: none"])');
		var notVisible = $('svg circle[style *= "display: none"]');
		var expected = angular.element($('[ng-controller=dataController]')).scope().filteredItems;


		notVisible.each(function() {
			var currentNonVis = $(this);

			expected.some(function (e) {

				if (e.id == currentNonVis.attr('id')) {
					currentNonVis.css('display', 'inline');
					console.log("added Missing point")
					return true;
				}

				else {
					return false;
				}
			});
		});

		visible = $('svg circle:not([style *= "display: none"])');

		if (expected.length === visible.length) {
			// console.log("all good")
		}

		else {
			// console.log("not all good");
		}	
	}

}

/*
	When filtering items, some items do not finish animation.
	Makes sure all datapoints are the same.
	Called when filtering data by auction titles.
*/	
function cleanGraph() {
	
	var shown = $('svg circle[r="2"]');
	var expected = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
	var circles = d3.selectAll('circle').data(expected);

	circles.each(function() {

		var thisCircle = d3.select(this);
		if (thisCircle.attr('r') != 2) {
			// console.log("fixing " , thisCircle.attr('r'));

			thisCircle
				.transition()
				.duration(1000)
				.attr('r', 2)
				.attr('fill', 'black')
				.attr('fill-opacity',1)
		}
	});	
}



function drawViz2() {
	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;

	var max = d3.max(data, function(d) {return d.finalPrice;});

	var interval = 50;
	max = Math.ceil(max/interval) * interval;

	var steps = max / interval;

	var viz2Data = [];

	var dates = [];

	for (var i=0; i<steps; i++) {

		//initialize array
		viz2Data[i] = 0


		data.forEach(function(d) {

			if (d.finalPrice <= ( (i+1) * interval) && d.finalPrice > (i * interval)) {
				viz2Data[i]++;
			}

		});
	}

	// data.forEach(function(d) {

	// 	console.log(d.endTime.str);

	// 	var currentDate = new Date(d.endTime.str);
	// 	currentDate = currentDate.getDateString();

	// 	if (dates.indexOf(currentDate) === -1) {
	// 		dates.push(currentDate);
	// 		dates[currentDate] = [];

	// 		for (var k=0; k<steps; k++) {
	// 			dates[currentDate]
	// 		}
	// 	}

	// 	else {

	// 		for (var j=0; j<steps; j++) {

	// 			dates[currentDate]

	// 		}
			
	// 	}

	// });


	console.log("max ", max)
	console.log("interval ", interval , "steps ", steps)

// console.log(	d3.select('#vizDiv').select('svg')
// 		.data(viz2Data))

	d3.selectAll('#vizDiv svg > *')
		// .transition()
		.remove();

	d3.select('#vizDiv svg').selectAll('circle')
		.data(viz2Data).enter()
		.append('circle')
		.attr('fill', "green")
		.attr('cx', 5)
		.attr('cy', function(d) {
			console.log(viz2Data.length)
			console.log(d)
			return d;
		})
		.attr('r', function(d) {
			return d;
		});
						
}