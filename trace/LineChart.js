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
	 * - `brush`: This will enable drag selections of the line chart. This is a function which accepts a single element of the extent, the x0 and x1 positions of the brush box.
	 *
	 * @class  LineGraph
	 * @constructor
	 *
	 * @param {[type]} options [description]
	 */
	var LineGraph = function (options) {

		Trace.call(this);

		this._extend(this.options, {
			showx: true,
			showy: true,
			showpoints: true,
			interpolate: 'linear',
			gridlines: true,
			brush: false
		}, options);

		this.__parent__ = Trace;

		this.lines = {};
		this.areas = {};
		this.linePaths = {};
		this.areaPaths = {};
		this.points = {};
		this.series = [];
		this.legend = [];

		this._build();
	};

	/**
	 * Extends the Trace base library
	 * @extends {Trace}
	 * @type {Trace}
	 */
	LineGraph.prototype = Object.create(Trace.prototype);
	LineGraph.prototype.constructor = LineGraph;

	/**
	 * Calculate the domains/ranges for the line chart
	 *
	 * We use the getExtremes method to find the max and min for each of the dimensions, check
	 * to see if its a date using `toString` if it is use a time scale otherwise use a linear
	 * scale.
	 *
	 * @private
	 */
	LineGraph.prototype._calculate = function () {

		var maxX = this._getExtremes(this.options.data, 0, 'max'),
			minX = this._getExtremes(this.options.data, 0, 'min'),
			minY = this._getExtremes(this.options.data, 1, 'min'),
			maxY = this._getExtremes(this.options.data, 1, 'max'),
			margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		minY = toString.call(minY) === '[object Date]' ? minY : minY > 0 ? 0 : minY;

		// determine if we are dealing with dates, we want to use a more
		// intelligent tick formatter than the default (it's a big ugly)

		this.xfunc = toString.call(minX) === '[object Date]' ? d3.time.scale() : d3.scale.linear();
		this.xfunc.domain([minX, maxX]).range([0, width - margin[1] - margin[3]]);

		this.yfunc = toString.call(maxY) === '[object Date]' ? d3.time.scale() : d3.scale.linear();
		this.yfunc.domain([minY, maxY]).range([height - margin[0] - margin[2], 0]);
	};

	/**
	 * Tick the graph when we get new data.
	 *
	 * We also have to tick the axis. If we have points, those need to be moved as well
	 *
	 * @private
	 */
	LineGraph.prototype._tick = function () {

		// recalculate everything
		this._calculate();

		Object.keys(this.linePaths).forEach(function (path) {

			this.linePaths[path].transition()
				.duration(100)
				.ease('linear')
				.attr('d', this.lines[path](this.options.data[path]));

			this.areaPaths[path].transition()
				.duration(100)
				.ease('linear')
				.attr('d', this.areas[path](this.options.data[path]));

			if (this.options.showpoints) {
				this.points[path].data(this.options.data[path])
					.transition()
					.duration(100)
					.ease('linear')
					.attr('cx', function (d, i) { return this.xfunc(d[0]); }.bind(this))
					.attr('cy', function (d, i) { return this.yfunc(d[1]); }.bind(this));
			}

		}.bind(this));

		Trace.prototype._tick.call(this);
	};

	/**
	 * Draw the chart. We draw each line and each axis
	 *
	 * @private
	 */
	LineGraph.prototype._draw = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		// build the SVG wrapper
		this.chart = d3.select(this.options.div)
			.append('svg')
			.attr('class', 'trace-linegraph')
			.attr('height', height)
			.attr('width', width)
			.attr('viewbox', '0 0 ' + width + ' ' + height)
			.attr('perserveAspectRatio', "xMinYMid")
			.append('g')
			.attr('transform', 'translate(' + margin[3] + ',' + (margin[0])+ ')');

		// for each series build in the line
		this.series.forEach(function (s) {
			this.lines[s] = d3.svg.line()
				.x(function (value) {
					return value[0] ? this.xfunc(value[0]) : this.xfunc(0);
				}.bind(this))
				.y(function (value) {
					return value[1] ? this.yfunc(value[1]) : this.yfunc(0);
				}.bind(this))
				.interpolate(this.options.interpolate);

			this.areas[s] = d3.svg.area()
				.x(function (d) { return this.xfunc(d[0]); }.bind(this))
    			.y0(height - margin[0] - margin[2])
    			.y1(function (d) { return this.yfunc(d[1]); }.bind(this));
		}.bind(this));

		// now draw each of the lines
		Object.keys(this.lines).forEach(function (series, i) {
			var color = this.colors(i);

			this.linePaths[series] = this.chart.append('path')
				.attr('d', this.lines[series](this.options.data[series]))
				.attr('class', 'trace-' + series)
				.attr('stroke', color)
				.attr('stroke-width', '2px')
				.attr('fill', 'none');

			this.areaPaths[series] = this.chart.append('path')
				.datum(this.options.data[series])
				.attr('class', 'area')
				.attr('d', this.areas[series])
				.attr('fill', color)
				.attr('opacity', 0.2);

			// draw the points
			if (this.options.showpoints) {
				this.points[series] = this.chart.selectAll('.point')
					.data(this.options.data[series])
				.enter().append('circle')
					.attr('fill', color)
					.attr('class', 'trace-' + series)
					.attr('cx', function (d, i) { return this.xfunc(d[0]); }.bind(this))
					.attr('cy', function (d, i) { return this.yfunc(d[1]); }.bind(this))
					.attr('r', function (d, i) { return 3; })
					.attr('style', 'cursor:pointer');

				this.points[series] = this.chart.selectAll('.point')
						.data(this.options.data[series])
					.enter().append('circle')
						.attr('fill', 'white')
						.attr('opacity', 0)
						.attr('class', 'trace-' + series)
						.attr('cx', function (d, i) { return this.xfunc(d[0]); }.bind(this))
						.attr('cy', function (d, i) { return this.yfunc(d[1]); }.bind(this))
						.attr('r', function (d, i) { return 6; })
						.attr('style', 'cursor:pointer')
						.on('mouseover', this._mouseover.bind(this))
						.on('mouseout', this._mouseout.bind(this));
			}
		}.bind(this));

		// optional selecting of an area of the chart
		if (this.options.brush) {
			var brush = d3.svg.brush()
				.x(this.xfunc)
				.on('brushend', function () {
					if (!d3.event.sourceEvent) return;
					this.options.brush(brush.extent());
				}.bind(this));

			var gbrush = this.chart.append('g')
				.attr('class', 'brush')
				.call(brush)
				.call(brush.event);

			gbrush.selectAll('rect')
				.attr('height', this.options.height - this.options.margin[0] - this.options.margin[2]);
		}
	};

	/**
	 * Build the line graph
	 *
	 * @private
	 *
	 * @return {[type]} [description]
	 */
	LineGraph.prototype._build = function () {
		this.series = Object.keys(this.options.data);
		this._calculate();
		this._draw();
		// call the parent method
		Trace.prototype._build.call(this);
	};

	return LineGraph;
});
