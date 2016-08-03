/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3'
], function (d3) {

	'use strict';

	/**
	 * Trace is a dynamic charting library which utilises (d3)[http://d3js.org]. It supports a wide
	 * variety of data and is easily extenseable with new graph types.
	 *
	 * ## Usage
	 * `new Trace[<Chart Type>](options)`
	 *
	 * ## Options
	 * These are the default options available to each chart
	 *
	 * - **div**: The element to render the chart within
	 * - **data**: The data you are supplying it needs to be in the format of
	 *     `{
	 *       <series1>: [[x,y]...],
	 *       ...
	 *     }`
	 * - **width**: Width of the graph in pixels
	 * - **height**: Height of the graph in pixels
	 * - **tooltips**: Accepts `true` or a function to format the data
	 * - **legend**: `true` | `false` to show/hide the legend
	 * - **gridlines**: `true` | `false` to show/hide the horizontal gridlines
	 * - **margin**: Margin around the graph [top, right, bottom, left] if you choose to have axis,
	 * these values will need to be adjusted to fit in the axis values
	 * - **colors**: An `Array` of hex colours
	 *
	 * ## Formatting Tooltips
	 * The parameter allows you to easily format the tooltips. The function is passed an arr with
	 * the first index being the `x` value and the second being the `y` value.
	 *
	 *     new Trace.lineGraph({
	 *     		data: {'Example': [[1,1], [2,2], [3,3]]},
	 *     		tooltips: function (vals) {
	 *     			return 'x:' + vals[0] + ' y:' + vals[1];
	 *     		}
	 *     });
	 *
	 * @param {Object} options [description]
	 */
	var Trace = function (options) {

		this.emptyFunction = function (d) {
			return d;
		};

		this.options = {
			data: {},
			points: true,
			width: 500,
			height: 500,
			tooltips: function (evt) {
				return JSON.stringify(evt);
			},
			legend: true,
			margin: [20,20,20,20],
			xTickCount: null,
			yTickCount: null,
			xTickFormat: null,
			yTickFormat: null,
			zoom: false,
			colors: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6']
		};
	};

	/**
	 * ## Update
	 * Update the chart with a new set of data. The chart will transition to the new data points.
	 *
	 * If you are showing scales and gridlines, updating the data will cause the scales and
	 * gridlines to be altered accordingly.
	 *
	 * ### Dynamic Chart
	 * In this example we are updating the line chart with data every second, we are keeping the x
	 * axis constant.
	 *
	 *     var linegraph = new Trace.lineGraph({
	 *     		data: {'Example': },
	 *     		tooltips: function (vals) {
	 *     			return 'x:' + vals[0] + ' y:' + vals[1];
	 *     		}
	 *     });
	 *
	 * 	   setInterval(function () {
	 * 	   		var data = [[1,1], [2,2], [3,3]];
	 * 	   		data = data.map(function (val) {
	 * 	   			return [val[0], Math.round(Math.random() * 10)];
	 * 	   		});
	 * 	   		linegraph.update(data);
	 * 	   }, 1000);
	 *
	 * @param  {Object} data See @Trace
	 * @return {[type]}      [description]
	 */
	Trace.prototype.update = function (data) {
		if (data) {
			this.options.data = data;
		}
		// recalculate the graph, animating or not
		this._tick();
	};

	/**
	 * Uses the d3 ordinal scale to cycle through a set number of colours
	 *
	 * @param  {Int} i The current item
	 */
	Trace.prototype.colors = function (i) {
		if (!this.colorScale) {
			// convert the colour scale
			this.colorScale = d3.scaleOrdinal().range(this.options.colors);
		}
		return this.colorScale(i);
	};

	Trace.prototype._extend = function (destination) {
		Array.prototype.slice.call(arguments, 1).forEach(function (source) {
			for (var prop in source) {
				destination[prop] = source[prop];
			}
		});
		return destination;
	};

	/**
	 * Get the extremes of the data range
	 *
	 * @private
	 *
	 * @param  {Object} data	The data to search
	 * @param  {Int}	i		The index we want to look at
	 * @param  {String} type	The type of comparison (see d3 docs for more info)
	 * @return {Int}			Return the number
	 */
	Trace.prototype._getExtremes = function (data, i, type) {
		var comparator = [];
		Object.keys(data).forEach(function (series) {
			data[series].forEach(function (data) {
				comparator.push(data[i]);
			});
		});
		return d3[type](comparator);
	};

	Trace.prototype._tick = function () {
		if (this.xaxis) {
			this.xaxis.call(d3.axis().scale(this.xfunc).orient('bottom').ticks(5).tickFormat(this.options.xTickFormat));
		}

		if (this.yaxis) {
			this.yaxis.call(d3.axis().scale(this.yfunc).orient('left').ticks(5).tickFormat(this.options.yTickFormat));
		}

		if (this.options.gridlines) {
			this.gridlines.data(this.yfunc.ticks(5))
				.transition()
				.duration(100)
				.ease('linear')
				.attr('y1', function (d) { return this.yfunc(d); }.bind(this))
				.attr('y2', function (d) { return this.yfunc(d); }.bind(this));
		}
	};

	Trace.prototype._mouseover = function (evt) {

		if (this.options.mouseover) {
			this.options.mouseover(evt);
			return;
		}

		if (this.options.tooltips) {
			this.tooltip = document.createElement('div');
			this.tooltip.className = 'trace-tooltip';
			this.tooltip.innerHTML = this.options.tooltips(evt);
			this.tooltip.style.left = (d3.event.clientX + window.scrollX + 10) + 'px';
			this.tooltip.style.top = (d3.event.clientY + window.scrollY) + 'px';
			document.body.appendChild(this.tooltip);
		}
	};

	Trace.prototype._zoom = function () {
		this.zoom = d3.behavior.zoom()
			.scaleExtent([1, 10])
			.on('zoom', function () {
				this.svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			}.bind(this));

		this.drag = d3.behavior.drag()
			.origin(function(d) { return d; })
			.on("dragstart", this._dragstarted.bind(this))
			.on("drag", this._dragged.bind(this))
			.on("dragend", this._dragended.bind(this));
	};

	Trace.prototype._dragstarted = function () {};
	Trace.prototype._dragged = function () {};
	Trace.prototype._dragended = function () {};

	/**
	 * Just remove the tooltip when we mouse out
	 *
	 * @todo This could be down a lot better, currently this will flickr if you hover
	 * the tooltip
	 *
	 * @param  {Object} evt mouse out event
	 */
	Trace.prototype._mouseout = function (evt) {

		if (this.options.mouseout) {
			this.options.mouseout(evt);
			return;
		}

		if (this.tooltip) {
			this.tooltip.parentNode.removeChild(this.tooltip);
		}
	};

	// private methods
	Trace.prototype._build = function () {

		// xaxis
		if (this.options.showx) {
			this.xaxis = this.chart.append('g')
				.attr('class', 'trace-xaxis')
				.attr('transform', 'translate(0,' + (this.options.height - this.options.margin[0] - this.options.margin[2]) + ')')
				.call(d3.axisBottom(this.xfunc).ticks(this.options.xTickCount).tickFormat(this.options.xTickFormat));
		}

		// yaxis
		if (this.options.showy) {
			this.yaxis = this.chart.append('g')
				.attr('class', 'trace-yaxis left')
				.attr('transform', 'translate(0,0)')
				.call(d3.axisLeft(this.yfunc).ticks(this.options.yTickCount).tickFormat(this.options.yTickFormat));
		}

		// second y axis
		if (this.options.showy2) {
			this.yaxis2 = this.chart.append('g')
				.attr('class', 'trace-yaxis right')
				.attr('transform', 'translate(' + (this.options.width - this.options.margin[1] - this.options.margin[3]) + ',0)')
				.call(d3.axisRight(this.yfunc).ticks(this.options.yTickCount).tickFormat(this.options.yTickFormat));
		}

		// gridline
		if (this.options.gridlines) {
			this.gridlines = this.chart.selectAll('line.trace-gridline')
				.data(typeof this.yfunc.ticks !== 'undefined' ? this.yfunc.ticks(this.options.yTickCount) : this.xfunc.ticks(this.options.xTickCount))
			.enter()
				.append('line')
				.attr('class', 'trace-gridline')
				.attr('x1', 0)
				.attr('x2', this.options.width - this.options.margin[1] - this.options.margin[3])
				.attr('y1', function (d) { return this.yfunc(d); }.bind(this))
				.attr('y2', function (d) { return this.yfunc(d); }.bind(this))
				.attr('stroke-dasharray', '1, 1');
		}

		// render the legend
		if (this.options.legend) {
			this._legend();
		}

		// render the tooltips
		if (this.options.tooltips) {
			if (!this.options.points) {
				throw 'Tooltips require points to be set';
			}
		}
	};

	Trace.prototype._legend = function () {

		// if we don't have a name for any series, don't show it in the legend
		var series = Object.keys(this.options.data).filter(function (item) {
			if (item && item !== 'undefined') {
				return item;
			}
		});

		d3.select(this.options.div)
			.append('div')
			.attr('class', 'trace-legend')
			.selectAll('div.label')
			.data(series)
		.enter()
			.append('div')
			.attr('class', 'label')
			.html(function (d, i) {
				return '<div class="key" style="border-left: 5px solid ' + this.colors(i) + '">' + d + '</div>';
			}.bind(this));
	};

	return Trace;
});
