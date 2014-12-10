var d3Globals = {}
d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};
d3Globals.padding = 40;
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

	d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};


	function drawViz() {
		var dimens = d3Globals.dimens;
		var padding = 40;

		var scope = angular.element($('[ng-controller=dataController]')).scope();
		var data = scope.filteredItems;


		var tip = d3.tip().attr('class', 'd3-tip')
					.html(function(d) {

						var dateString = new Date(d.endTime.str);
						var price = d.price;
						var shipped = d.finalPrice;

						var output = dateString.toLocaleString() + "</br>" + 
									"Price: " + price + "<br/>" + 
									"After Shipping: " + shipped;

						return output;

					});

		var svg = d3.select('#vizDiv').append('svg')
			.attr('width', dimens.w)
			.attr('height', dimens.h);

		svg.call(tip);

		var xScale = d3.time.scale()
						.domain(
							[d3.min(newItems, function(d) { 
								var currentDate = new Date(d.endTime.date);
								currentDate = new Date(currentDate.toLocaleDateString());
								return currentDate;
								}),
							 d3.max(newItems, function(d) {
							 	var currentDate = new Date(d.endTime.date);
							 	currentDate = new Date(currentDate.toLocaleDateString());
							 	return currentDate;
							})]
						)
						.range([0 + padding, dimens.w - padding]);
			


		var xAxis = d3.svg.axis();
		xAxis.scale(xScale).orient('bottom').ticks(5);

		var yScale = d3.scale.linear()
						.domain(
							[0, d3.max(newItems, function(d) {return d.finalPrice;})]
						)
						.range([dimens.h - padding, padding]);

		var yAxis = d3.svg.axis();
		yAxis.scale(yScale).orient('left').ticks(5);


		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + (dimens.h - padding) + ')')
			.call(xAxis);


		svg.append('g')
			.attr('class', 'y axis')
			.attr('transform', 'translate(' + padding + ',0 )')
			.call(yAxis);


		svg.selectAll('circle')
			.data(newItems)
			.enter()
			.append('a').attr('xlink:href', function(d) {

				return "#"+data.indexOf(d);
			})
			.append('circle')
			.attr('cx', function(d) {
				var currentDate = new Date(d.endTime.date);
				currentDate = new Date(currentDate.toLocaleDateString());
				// console.log(currentDate.getDateString(), xScale(currentDate));
				return xScale(currentDate);
				// return 1;
			})
			.attr('cy', function(d) {
				return yScale(d.finalPrice);
			})
			.attr('r', function(d) {
				return 2;
			})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

	}

	drawViz();
	
});



function updateViz() {
	console.log('update called')
	var svg = d3.select('#vizDiv').select('svg');

	var dimens = d3Globals.dimens = {"w": $('#vizDiv').width() * .95, "h": $('#vizDiv').height() * .95};


	var scope = angular.element($('[ng-controller=dataController]')).scope();
	var data = scope.filteredItems;

	console.log(data.length)
	// console.log(d3.max(data, function(d){return d.finalPrice}))


	var circles = svg.selectAll('circle').data(data);

	console.log("circles ", circles);	
	var padding = 40;

	var xScale = d3.time.scale()
					.domain(
						[d3.min(data, function(d) { 
							var currentDate = new Date(d.endTime.date);
							currentDate = new Date(currentDate.toLocaleDateString());
							console.log("update ", currentDate);
							return currentDate;
							}),
						 d3.max(data, function(d) {
						 	var currentDate = new Date(d.endTime.date);
						 	currentDate = new Date(currentDate.toLocaleDateString());
						 	console.log("update max ", currentDate)
						 	return currentDate;
						})]
					)
					.range([0 + padding, dimens.w - padding]);

	console.log(d3.min(data, function(d) { 
							var currentDate = new Date(d.endTime.date);
							currentDate = new Date(currentDate.toLocaleDateString());
							return currentDate;
							}), d3.max(data, function(d) {
						 	var currentDate = new Date(d.endTime.date);
						 	currentDate = new Date(currentDate.toLocaleDateString());
						 	return currentDate;
						}))

	var xAxis = d3.svg.axis();
	xAxis.scale(xScale).orient('bottom').ticks(5);

	var yScale = d3.scale.linear()
					.domain(
						[0, d3.max(data, function(d) {return d.finalPrice;})]
					)
					.range([dimens.h - padding, padding]);

	var yAxis = d3.svg.axis();
	yAxis.scale(yScale).orient('left').ticks(5);

	svg.select('.x.axis')
		.transition()
		.duration(1000)
		.call(xAxis);
	svg.select('.y.axis')
		.transition()
		.duration(1000)
		.call(yAxis);

	svg.call(d3Globals.tip);

	circles.transition()
		.duration(1000)
		.each("start", function(d) {
			d3.select(this)
				.attr('fill', 'red')
				.attr('r', '7');
		})
		.attr('cx', function(d) {
			var currentDate = new Date(d.endTime.date);
			currentDate = new Date(currentDate.toLocaleDateString());

			console.log(currentDate.getDateString(), xScale(currentDate));
			return xScale(currentDate);
		})
		.attr('cy', function(d) {
			return yScale(d.finalPrice);
		})
		.transition()
		.duration(1000)
		.attr('fill', 'black')
		.attr('r', '2');

	circles.enter()
		.append('a').attr('xlink:href', function(d) {
			return "#"+data.indexOf(d);
		})
		.append('circle')
		.attr('cx', function(d) {
			var currentDate = new Date(d.endTime.date);
			currentDate = new Date(currentDate.toLocaleDateString());
			console.log(currentDate.getDateString(), xScale(currentDate));
			return xScale(currentDate);
			// return 1;
		})
		.attr('cy', function(d) {
			return yScale(d.finalPrice);
		})
		.attr('r', function(d) {
			return 0;
		})
		.on('mouseover', d3Globals.tip.show)
		.on('mouseout', d3Globals.tip.hide)
		.transition()
		.duration(2000)
		.attr('r', function(d) {
			return 5;
		})

	circles.exit().transition().remove();
}