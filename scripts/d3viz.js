var d3Globals = {}
d3Globals.dimens = {"w": 600, "h": 200};
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

	function drawViz() {
		var dimens = {"w": 600, "h": 200};
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
								return currentDate;
								}),
							 d3.max(newItems, function(d) {
							 	var currentDate = new Date(d.endTime.date);
							 	return currentDate;
							})]
						)
						.range([0 + padding, dimens.w - padding]);
						

		var xAxis = d3.svg.axis();
		xAxis.scale(xScale).orient('bottom').ticks(7);

		var yScale = d3.scale.linear()
						.domain(
							[0, d3.max(newItems, function(d) {return d.finalPrice;})]
						)
						.range([dimens.h - padding, padding]);

		var yAxis = d3.svg.axis();
		yAxis.scale(yScale).orient('left').ticks(5);


		svg.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + (dimens.h - padding) + ')')
			.call(xAxis);


		svg.append('g')
			.attr('class', 'axis')
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
				console.log(currentDate.getDateString(), xScale(currentDate));
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

	var scope = angular.element($('[ng-controller=dataController]')).scope();
	var data = scope.filteredItems;

	console.log(data.length)

	console.log(svg.selectAll('circle'));

	var circles = svg.selectAll('circle').data(data);

	console.log("circles ", circles);	
	var padding = 40;

	var xScale = d3.time.scale()
					.domain(
						[d3.min(data, function(d) { 
							var currentDate = new Date(d.endTime.date);
							return currentDate;
							}),
						 d3.max(data, function(d) {
						 	var currentDate = new Date(d.endTime.date);
						 	return currentDate;
						})]
					)
					.range([0 + padding, 600 - padding]);

	var yScale = d3.scale.linear()
					.domain(
						[0, d3.max(newItems, function(d) {return d.finalPrice;})]
					)
					.range([200 - padding, padding]);

	svg.call(d3Globals.tip)

	circles.enter()
		.append('a').attr('xlink:href', function(d) {
			return "#"+data.indexOf(d);
		})
		.append('circle')
		.attr('cx', function(d) {
			var currentDate = new Date(d.endTime.date);
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