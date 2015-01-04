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

	d3.select(window).on('resize', resize);

	d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};

	function drawViz() {
		var dimens = d3Globals.dimens;
		var padding = d3Globals.padding;

		var scope = angular.element($('[ng-controller=dataController]')).scope();
		var data = scope.filteredItems;

		var tip = d3Globals.tip

		var svg = d3Globals.svg = d3.select('#vizDiv').append('svg')
			.attr('width', dimens.w)
			.attr('height', dimens.h);

		svg.call(tip);

		d3Globals.earliestDate = d3.min(data, function(d) { 
								var currentDate = new Date(d.endTime.date);
								currentDate = new Date(currentDate.toLocaleDateString());
								return currentDate;
							});
		d3Globals.latestDate = d3.max(data, function(d) {
							 	var currentDate = new Date(d.endTime.date);
							 	currentDate = new Date(currentDate.toLocaleDateString());
							 	return currentDate;
							});

		var xScale = d3Globals.xScale = d3.time.scale()
						.domain([d3Globals.earliestDate, d3Globals.latestDate])
						.range([0 + padding.x, dimens.w - padding.x]);
		
		var xAxis = d3.svg.axis();
		xAxis.scale(xScale).orient('bottom').ticks(3);

		var yScale = d3Globals.yScale = d3.scale.linear()
						.domain(
							[0, d3.max(data, function(d) {return d.finalPrice;})]
						)
						.range([dimens.h - padding.y, padding.y]);

		var yAxis = d3.svg.axis();
		yAxis.scale(yScale).orient('left').ticks(5);


		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (dimens.h - padding.y) + ')')
			.call(xAxis);
		
		if (d3Globals.earliestDate.toString() === d3Globals.latestDate.toString()) {
			d3Globals.small = true;
		}
		
		if (d3.selectAll('.x g.tick')[0].length === 1) {
			d3.select('.x g.tick')
				.attr('fill', 'green')
				.attr('transform', 'translate(' + (dimens.w - padding.x) / 2 + ',' +  (0) + ')');
		}

		if (d3.selectAll('.x g.tick')[0].length === 0) {

		}


		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + padding.x + ',0 )')
			.call(yAxis);

		addData();
	}
	drawViz();
});

function addData() {

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
			return "#"+newItems.indexOf(d);
		})
		.append('circle')
		.attr('cx', function(d) {
			if (d3Globals.small === true) {

				var center = (d3Globals.dimens.w - d3Globals.padding.x) / 2;
				return center;
			}
			else {
				var currentDate = new Date(d.endTime.date);
				currentDate = new Date(currentDate.toLocaleDateString());
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
			console.log("this ", this , " d " , d)
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

/*
	if addingNewData is not undefined, show old values by marking them red
	else move without changing style
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
			var currentDate = new Date(d.endTime.date);
			currentDate = new Date(currentDate.toLocaleDateString());

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
								var currentDate = new Date(d.endTime.date);
								currentDate = new Date(currentDate.toLocaleDateString());
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
	adjust scale and svg width and height
	called when window is resized or updateViz is called
*/
function resize() {

	var svg = d3Globals.svg;

	var dimens = d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
	d3Globals.svg.attr('height', dimens.h).attr('width', dimens.w);
	var padding = d3Globals.padding;
	
	var data = angular.element($('[ng-controller=dataController]')).scope().filteredItems;

	var total = 0;
	data.forEach(function (d) {
		total += d.finalPrice;
	})
	var avg = total / data.length;

	var variance = 0;
	data.forEach(function(d) {
		var diff = (d.finalPrice - avg);
		diff *= diff;
		variance += diff;
	});
	variance /= data.length;
	
	var stddev = Math.sqrt(variance);

	var minRange = avg - (2*stddev);
	var maxRange = avg + (2*stddev);

	console.log("min range " , minRange , " avg " , avg , " max range " , maxRange);

	var xScale = d3Globals.xScale = d3.time.scale()
					.domain(
						[d3.min(data, function(d) { 
							var currentDate = new Date(d.endTime.date);
							currentDate = new Date(currentDate.toLocaleDateString());
							return currentDate;
							}),
						 d3.max(data, function(d) {
						 	var currentDate = new Date(d.endTime.date);
						 	currentDate = new Date(currentDate.toLocaleDateString());
						 	return currentDate;
						})]
					)
					.range([0 + padding.x, dimens.w - padding.x]) || d3Globals.xScale;

	var xAxis = d3.svg.axis();
	xAxis.scale(xScale).orient('bottom').ticks(3);

	var yScale = d3Globals.yScale = d3.scale.linear()
					.domain(
						[0, d3.max(data, function(d) {return d.finalPrice;})]
					)
					.range([dimens.h - padding.y, padding.y]) || d3Globals.yScale;

	var yAxis = d3.svg.axis();
	yAxis.scale(yScale).orient('left').ticks(5);

	if (data.length !== 0) {
		
		svg.select('.x.axis')
			.transition()
			.duration(1000)
			.attr('transform', 'translate(0,' + (dimens.h - padding.y) + ')')
			.call(xAxis);
		svg.select('.y.axis')
			.transition()
			.duration(1000)
			.attr('transform', 'translate(' + padding.x + ',0 )')
			.call(yAxis);	

	}

	moveOldPoints();
}

/*
	whenever more results are added/filtered, update the svg 
*/
function updateViz(addingNewData) {

	var svg = d3Globals.svg;
	resize();

	var scope = angular.element($('[ng-controller=dataController]')).scope();
	var data = scope.filteredItems;

	console.log("data size ", data.length)
	var circles = svg.selectAll('circle').data(data);

	var links = svg.selectAll('svg a').data(data);
	links.exit().remove();

	circles.exit()
	.transition().attr('r', 4).attr('fill', 'red')
	.transition().attr('r', 0).remove();
	(addingNewData === undefined) ? moveOldPoints() : moveOldPoints(true);



	addData();

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
					console.log("inserted")
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