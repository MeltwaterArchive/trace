/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3',
	'./base'
], function (d3, Trace) {

	'use strict';

	/**
	 * # Bar Chart
	 * Renders a bar chart, or a stacked bar chart depending on the number of series supplied
	 *
	 * ## Usage
	 * `new Trace.barChart(options)`
	 *
	 * ## Options
	 * - `showx`: Show or hide the X axis, defaults to `true`
	 * - `showy`: Show or hide the Y axis, defualts to `true`
	 * 
	 * @class  BarChart
	 * @constructor
	 * 
	 * @param {[type]} options [description]
	 */
	var BarChart = function (options) {
		Trace.call(this, options);
		this.options.showx = true;
		this.options.showy = true;
		this._build();
	};

	/**
	 * Extends the Trace base library
	 * @extends {Trace}
	 * @type {Trace}
	 */
	BarChart.prototype = Object.create(Trace.prototype);
	BarChart.prototype.constructor = BarChart;

	/**
	 * Calculate the x and y functions
	 *
	 * We use the d3.layout.stack() and modify the data to be in the correct format
	 * 
	 * @private
	 */
	BarChart.prototype._calculate = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		// sort the data so it's indexed by x
		this.mappedData = Object.keys(this.options.data).map(function (series, i) {
			return this.options.data[series].map(function (d, ii) {
				return { x: d[0], y: +d[1] };
			});
		}.bind(this));

		this.stacked = d3.layout.stack()(this.mappedData);

		this.xfunc = d3.scale.ordinal().rangeRoundBands([0, width - margin[1] - margin[3]], 0.1);
		this.yfunc = d3.scale.linear().range([height - margin[0] - margin[2], 0]);

		this.xfunc.domain(this.stacked[0].map(function (d) { return d.x; }));
		
		var minnums = [], maxnums = [];
		this.stacked.forEach(function (section) {
			section.forEach(function (obj) {
				minnums.push(obj.y);
				maxnums.push(obj.y + obj.y0);
			});
		});

		this.yfunc.domain([0, d3.max(maxnums)]);
	};

	/**
	 * Tick the graph when we get new data
	 * @private
	 */
	BarChart.prototype._tick = function () {

		// recalculate everything
		this._calculate();

		// rebind the rectangles
		this.group.data(this.stacked);
		this.group.selectAll('rect').data(Object)
			.transition()
			.duration(100)
			.ease('linear')
			.attr('x', function (d) { return this.xfunc(d.x); }.bind(this))
			.attr("y", function (d) { return this.yfunc(d.y + d.y0); }.bind(this))
            .attr("height", function (d) { return this.yfunc(d.y0) - this.yfunc(d.y + d.y0); }.bind(this))
            .attr('width', this.xfunc.rangeBand());

        Trace.prototype._tick.call(this);
	};

	/**
	 * Draw the chart
	 */
	BarChart.prototype._draw = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		// build the SVG wrapper
		this.chart = d3.select(this.options.div)
			.append('svg')
			.attr('class', 'trace-barchart')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0 0 ' + width + ' ' + height)
			.attr('perserveAspectRatio', "xMinYMid")
			.append('g')
			.attr('transform', 'translate(' + margin[3] + ',' + (margin[0])+ ')');

		// wrap each of the series into a group
		this.group = this.chart.selectAll('g.trace-bargroup')
			.data(this.stacked)
		.enter()
			.append('g')
			.attr('class', 'trace-bargroup')
			.style('fill', function (d, i) { return this.colors(i); }.bind(this));

		// build a rect in each
		this.rect = this.group.selectAll('rect')
			.data(Object)
		.enter()
			.append('rect')
			.attr('x', function (d) { return this.xfunc(d.x); }.bind(this))
			.attr("y", function (d) { return this.yfunc(d.y + d.y0); }.bind(this))
            .attr("height", function (d) { return this.yfunc(d.y0) - this.yfunc(d.y + d.y0); }.bind(this))
            .attr('width', this.xfunc.rangeBand())
            .on('mouseover', this._mouseover.bind(this))
			.on('mouseout', this._mouseout.bind(this));
	};

	/**
	 * Build the bar chart
	 *
	 * @private
	 */
	BarChart.prototype._build = function () {
		this._calculate();
		this._draw();
		Trace.prototype._build.call(this);
	};

	return BarChart;
});