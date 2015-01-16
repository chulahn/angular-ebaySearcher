var d3Globals = {};
d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
d3Globals.padding = {"x": 40 , "y": 20};
d3Globals.small = false;

d3Globals.tip = d3.tip().attr('class', 'd3-tip')
					.html(function(d) {
						var dateString = new Date(d.endTime).toLocaleString();
						var price = d.price;
						var shipped = d.finalPrice;

						var output = dateString + "</br>" + 
									"Price: " + price + "<br/>" + 
									"After Shipping: " + shipped;

						return output;
					});
d3Globals.avgTip = d3.tip().attr('class', 'd3-tip')
						.html(function(d) {
							var dateString = d.date.getDateString();
							var priceString = d.priceString.toFixed(2);

							var output = dateString + "<br/>" +
										"Avg Price: " + priceString;
							return output;
						});

$(document).ready(function() {

	//var scope = angular.element($('[ng-controller=dataController]')).scope();
	d3.select(window).on('resize', updateAxes);

	getAvgPrices();
	drawViz();
	setDatePlaceHolder();
	addAvgPrices();
	//price
	$('#filterDiv input[type="number"]').on('keyup', function() {
		getAvgPrices();
		updateViz();
		setTimeout(cleanGraph, 1000);
		setDatePlaceHolder();
	});

	$('#filterDiv input[type="date"]').on('change', function() {
		getAvgPrices();
		updateViz();
		validDate();	
		setTimeout(cleanGraph, 1000);
	});

	$('#searchFilter').on('keyup', function() {
		getAvgPrices();
		updateViz();
		setTimeout(cleanGraph, 1000);
		setDatePlaceHolder();
	});

	//buttons
	$('#filterDiv input[type="checkbox"]').on('change', function() {
		getAvgPrices();
		setTimeout(updateViz, 100);
		setDatePlaceHolder();
	});

	function setDatePlaceHolder() {
		var earliest = d3Globals.earliestDate;
		var latest = d3Globals.latestDate;
		if (earliest) {
			$('#earliestSpan').html(earliest.getDateString());
			$('#latestSpan').html(latest.getDateString());

			var earlyPlaceHold = earliest.getInputString();
			var latePlaceHold = latest.getInputString();

			$('#earliestDateFilter').val(earlyPlaceHold);
			$('#earliestDateFilter').prop('min', earlyPlaceHold);
			$('#earliestDateFilter').prop('max', latest.getPrevDayInputString());

			$('#latestDateFilter').val(latePlaceHold);
			$('#latestDateFilter').prop('min', earliest.getNextDayInputString());
			$('#latestDateFilter').prop('max', latePlaceHold);
		}
	}

	function validDate() {
		var earliest = d3Globals.earliestDate;
		//var latest = d3Globals.latestDate;

		var currentEarly = $('#earliestDateFilter').val().toDate();
		var currentLate = $('#latestDateFilter').val().toDate();

		if (!(currentEarly <= currentLate)) {
			$('#earliestDateFilter').attr('class','invalid');
			// console.log(currentEarly , earliest, currentLate);
		}
		else {
			$('#earliestDateFilter').removeClass('invalid');
			$('#earliestDateFilter').attr('class', 'valid');
		}

		if (!(currentLate >= currentEarly)) {
			$('#latestDateFilter').attr('class','invalid');
		}
		else {
			$('#latestDateFilter').removeClass('invalid');
			$('#latestDateFilter').attr('class', 'valid');			
		}
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

	//circles = d3Globals.svg.selectAll('circle');

	d3Globals.svg.selectAll('dataPoint')
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
				var currentDate = d.endTime.toDate();
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
		.attr('class' , '.dataPoint')
		.attr('fill-opacity', .6)
		.attr('fill', 'green')

		.on('mouseover', function(d) {
			// console.log(d);
			d3.select(this).transition().duration(500)
				.attr('r', 10)
				.attr('class', 'hover');
			tip.show(d);})
		.on('mouseout', function(d) {
			d3.select(this).transition().duration(500)
				.attr('r', 2)
				.attr('class', '');
			tip.hide(d);})

		.transition()
		.duration(1000)
		.attr('fill', 'black')
		.attr('fill-opacity' , 1)
		.attr('r', '2');	
}

function getAvgPrices() {
	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
	var allAvgPrices = d3Globals.allAvgPrices = {};

	data.forEach(function(auction) {

		var endDate = auction.endTime.removeTime();

		if (allAvgPrices[endDate] === undefined) {
			var firstPrice = [];
			firstPrice.push(auction.finalPrice);
			allAvgPrices[endDate] = firstPrice;
		}
		else {
			allAvgPrices[endDate].push(auction.finalPrice);
		}
	});

	for (var date in allAvgPrices) {

		if (allAvgPrices.hasOwnProperty(date)) {
			var avgDatePrice = allAvgPrices[date].getAvg();
			allAvgPrices[date] = {num : allAvgPrices[date].length , avgPrice : avgDatePrice};
		}
	}

	var outputArray = toArray(allAvgPrices);

	outputArray.sort(function(a,b){

		return (a.date - b.date);

	});
	d3Globals.a = outputArray;
}

function addAvgPrices() {

	var xScale = d3Globals.xScale;
	var yScale = d3Globals.yScale;
	
	var data = d3Globals.a;
	
	d3Globals.svg.selectAll('.avgPoint')
		.data(data)
		// .call(d3Globals.avgTip)
		.enter()
		.append('circle')
		.attr('cx', function(d) {
			return xScale(d.date);
		})
		.attr('cy', function(d) {
			return yScale(d.avgPrice);
		})
		.attr('class', 'avg')
		.attr('r', 10)
		.attr('fill', 'blue')
		.attr('fill-opacity', .4)
		;

	d3Globals.svg.selectAll('avgLine')
		.data(d3Globals.a)
		.enter()
		.append('line')

		.attr('x1', function(d, i) {
			// console.log("index " , i , " " ,d.date);
			return xScale(d.date);
		})
		.attr('y1', function(d, i) {
			// console.log(yScale(d.avgPrice))
			return yScale(d.avgPrice);
		})
		.attr('x2', function(d, i) {
			var nextElem = data[i+1];

			if (nextElem) {
				// console.log(nextElem.date);
				return xScale(nextElem.date);
			}
		})
		.attr('y2', function(d, i) {
			var nextElem = data[i+1];

			if (nextElem) {
				return yScale(nextElem.avgPrice);
			}
		})
		.style('stroke', function(d,i) {
			
			var nextElem = data[i+1];
			var color = 'black';
			if (nextElem) {

				if(i%5 ===0) {
					color = 'black'
				}
				if (i%5 == 1) {
					color = 'red'
				}
				if (i%5 == 2) {
					color = 'blue'
				}
				if (i%5 == 3) {
					color = 'orange'
				}
				return color;
			}
			else {
				// console.log('----')
			}
		})

		;

}

/*
	If new points are being added, show old values by marking them red
	Else move without changing style
	Used in updateAxes() and updateViz()
*/
function moveOldPoints(addingNewData) {

	console.log("moveOldPoints: addingNewData= " , addingNewData)
	var scope = angular.element($('[ng-controller=dataController]')).scope();
	var data = scope.filteredItems;

	var dataPoints = d3Globals.svg.selectAll('.dataPoint').data(data);
	var avgData = d3Globals.svg.selectAll('.avgPoint').data(d3Globals.a);

	var xScale = d3Globals.xScale;
	var yScale = d3Globals.yScale;

	avgData
		.each(function(d) {
			//d3.select allows d3 animations to be used
			var currentPoint = d3.select(this);

			//when adding new data, highlight old points, 
			if (addingNewData !== undefined) {
				var currentX = parseInt(currentPoint.attr('cx'));
				var currentY = parseInt(currentPoint.attr('cy'));

				var newX = parseInt(xScale(d.date));
				var newY = parseInt(yScale(d.avgPrice));

				if ((currentX !== newX) || (currentY !== newY)) {
					console.log("x " , currentX , newX, " y " , currentY , newY);

					currentPoint
						.transition()
						.duration(500)
							.attr('fill', 'yellow')
							.attr('r', '10')
							.attr('fill-opacity', .6)
							.attr('cx', function(d) {
								return xScale(d.date);
							})
							.attr('cy', function(d) {
								return yScale(d.avgPrice);
							})
							.attr('id', function(d) {
								return d.id;
							})
						.transition()
						.duration(1000)
							.attr('fill', 'black')
							.attr('r', '6')
							.attr('fill-opacity', 1);
				}
			}
			else {
				currentPoint
					.transition()
					.duration(500)
					.attr('cx' , function(d) {
						return xScale(d.date)
					})
					.attr('cy' , function(d) {
						return yScale(d.avgPrice)
					});
			}
	});

	dataPoints
		.each(function(d) {
			
			var currentPoint = d3.select(this);
			var pNode = d3.select(this.parentNode);
			var currentDate = d.endTime.toDate();

			if (addingNewData !== undefined) {
				
				var currentX = parseInt(currentPoint.attr('cx'));
				var currentY = parseInt(currentPoint.attr('cy'));

				var newX = parseInt(xScale(currentDate));
				var newY = parseInt(yScale(d.finalPrice));

				if ((currentX !== newX) || (currentY !== newY)) {
					console.log("x " , currentX , newX, " y " , currentY , newY);

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
							.attr('fill-opacity', 1);
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
								var currentDate = d.endTime.toDate();
								return xScale(currentDate);
							}
						})
						.attr('cy', function(d) {
							return yScale(d.finalPrice);
						})
						.attr('id', function(d) {
							return d.id;
						});
			}

			pNode
				.attr('href', function(d) {
					return "#"+newItems.indexOf(d);
				});
		});
}

/*
	Sets the graph's dimens, and scale/axes.
	Used in updateAxes(), and drawViz()
*/
function setGraphDimens(create) {
	var dimens = d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
	var padding = d3Globals.padding;

	var scope = angular.element($('[ng-controller=dataController]')).scope();	
	//var data = scope.filteredItems;

	var minPrice = scope.minPrice;
	var maxPrice = scope.maxPrice;
	console.log('scopeMin:' , minPrice, ' scopeMax', maxPrice);
	console.log('globalMin: ', d3Globals.minPrice , ' globalMax: ' , d3Globals.maxPrice);

	if (create) {
		var svg = d3Globals.svg = d3.select('#vizDiv').append('svg')
			.attr('width', dimens.w)
			.attr('height', dimens.h);
		svg.call(d3Globals.tip);
	}
	else {
		d3Globals.svg.attr('height', dimens.h).attr('width', dimens.w);
	}

	getAxesDomain();
	setScales();


	//used for setting up the axes.  stores data in d3Global object
	function getAxesDomain() {
		var data = scope.filteredItems;
		
		d3Globals.earliestDate = d3.min(data, function(d) { 
									var currentDate = d.endTime.toDate() || d3Globals.earliestDate;
									return currentDate;
								});
		d3Globals.latestDate = d3.max(data, function(d) {
									var currentDate = (d.endTime.toDate() || d3Globals.latestDate);
									return currentDate;
								});

		d3Globals.minPrice = d3.min(data, function(d) {return d.finalPrice;});
		d3Globals.maxPrice = d3.max(data, function(d) {return d.finalPrice;});
	}

	//create scales and axes based on getAxesDomain() and stores in d3Global object/ or use previous
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
		console.log('scopeMax: ', maxPrice, " globalsMax: ", d3Globals.maxPrice)
	}
}

/*
	Creates the inital visualization.
	Called on page load.
*/
function drawViz() {

	setGraphDimens("create");
	var svg = d3Globals.svg;

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
	var svg = d3Globals.svg;

	setGraphDimens();

	if (data.length !== 0) {	
		calcStats();
		moveOldPoints();
	}
	
	//resizes axes
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


	//calculates avg price, std dev, range within 2 stddev
	function calcStats() {
		var stats = d3Globals.stats = {};

		// console.log(data);
	
		var avg = 0;
		data.forEach(function(c) {
			avg += c.finalPrice;
		});
		stats.avg = avg /= data.length;

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

		// console.log("min range " , minRange , " avg " , avg , " max range " , maxRange);
	}
}

/*
	First calls updateAxes() to set new axes.
	Scale old points and remove any filtered points.
	Then adds new points and any missing points.
	Called when adding/filtering data or resizing. 
*/
function updateViz(addingNewData) {

	updateAxes();
	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;
	var svg = d3Globals.svg;
	var dataPoints = svg.selectAll('.dataPoint').data(data);
	var links = svg.selectAll('svg a').data(data);

	// console.log("data size ", data.length);

	dataPoints.exit()
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
					console.log("added Missing point");
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
	var dataPoints = d3.selectAll('.dataPoint').data(expected);

	dataPoints.each(function() {

		var thisCircle = d3.select(this);
		if (thisCircle.attr('r') != 2) {
			// console.log("fixing " , thisCircle.attr('r'));
			thisCircle
				.transition()
				.duration(1000)
				.attr('r', 2)
				.attr('fill', 'black')
				.attr('fill-opacity',1);
		}
	});	
}
