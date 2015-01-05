/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3',
	'./base'
], function (d3, Trace) {

	'use strict';

	/**
	 * # Line Graph
	 * Renders a line graph.
	 *
	 * ## Usage
	 * `new Trace.lineGraph(options)`
	 *
	 * ## Options
	 * - `showx`: Show or hide the X axis, defaults to `true`
	 * - `showy`: Show or hide the Y axis, defualts to `true`
	 * - `showpoints`: Show the points on the line
	 * - `interpolate`: Type of line interpolation (whether it's curved or straight) see https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate
	 * 
	 * @class  LineGraph
	 * @constructor
	 * 
	 * @param {[type]} options [description]
	 */
	var PieChart = function (options) {

		Trace.call(this);

		this._extend(this.options, options);

		this._build();
	};

	/**
	 * Extends the Trace base library
	 * @extends {Trace}
	 * @type {Trace}
	 */
	PieChart.prototype = Object.create(Trace.prototype);
	PieChart.prototype.constructor = PieChart;

	PieChart.prototype._calculate = function () {
		this.pieData = Object.keys(this.options.data).map(function (key) {
			return {
				'value': this.options.data[key],
				'label': key
			};
		}.bind(this));
	};

	PieChart.prototype._tick = function () {

		// recalculate everything
		this._calculate();
		var arc = this.arc;

		this.arcs.data(this.pie(this.pieData, function (d) { return d.value; }))
			.transition()
			.ease('linear')
			.duration(100)
			.attrTween('d', function (a) {
				var i = d3.interpolate(this._current, a);
				this._current = i(0);
				return function (t) {
					return arc(i(t));
				};
			});

		Trace.prototype._tick.call(this);
	};

	/**
	 * Draw the chart. We draw each line and each axis
	 * 
	 * @private
	 */
	PieChart.prototype._draw = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width,
			radius = (width - margin[1] - margin[3]) / 2;

		if ((height - margin[0] - margin[2]) / 2 < radius) {
			radius = (height - margin[0] - margin[2]) / 2;
		}

		var center = (width - (radius*2) - margin[1] - margin[3]) / 2;

		this.pie = d3.layout.pie().value(function (d) {
			return d.value;
		});
		this.arc = d3.svg.arc().outerRadius(radius);

		this.chart = d3.select(this.options.div)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0 0 ' + width + ' ' + height)
			.attr('perserveAspectRatio', 'xMinYMid')
			.attr('class', 'trace-pie')
			.append('g')
				.attr('transform', 'translate(' + (margin[3] + radius + center) + ',' + (margin[0] + radius) + ')');

		Trace.prototype._build.call(this);

		this.arcs = this.chart.selectAll('path')
			.data(this.pie(this.pieData))
			.enter()
				.append('path')
				.attr('fill', function (d, i) { return this.colors(i); }.bind(this))
				.attr('d', this.arc)
				.on('mouseover', this._mouseover.bind(this))
				.on('mouseout', this._mouseout.bind(this))
				.each(function (d) {
					this._current = d;
				});

	};

	/**
	 * Build the line graph
	 *
	 * @private
	 * 
	 * @return {[type]} [description]
	 */
	PieChart.prototype._build = function () {
		this._calculate();
		this._draw();
	};

	return PieChart;
});