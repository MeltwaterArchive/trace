/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3',
	'./base'
], function (d3, Trace) {

	'use strict';

	/**
	 * # Likert
	 * Renders a bar chart, or a stacked bar chart depending on the number of series supplied
	 *
	 * ## Usage
	 * `new Trace.likert(options)`
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
	var Likert = function (options) {
		Trace.call(this);

		this._extend(this.options, {
			showx: true,
			showy: true,
			gridlines: true
		}, options);

		this._build();
	};

	/**
	 * Extends the Trace base library
	 * @extends {Trace}
	 * @type {Trace}
	 */
	Likert.prototype = Object.create(Trace.prototype);
	Likert.prototype.constructor = Likert;

	/**
	 * Calculate the x and y functions
	 *
	 * We use the d3.layout.stack() and modify the data to be in the correct format
	 * 
	 * @private
	 */
	Likert.prototype._calculate = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		// sort the data so it's indexed by x
		this.mappedData = Object.keys(this.options.data).map(function (series) {
			return this.options.data[series].map(function (d) {
				return { x: d[0], y: +d[1], series: series };
			});
		}.bind(this));

		this.stacked = d3.layout.stack().offset('expand')(this.mappedData);

		this.yfunc = d3.scale.ordinal().rangeRoundBands([0, height - margin[0] - margin[2]], 0.1);
		this.xfunc = d3.scale.linear().range([width - margin[1] - margin[3], 0]);

		this.yfunc.domain(this.stacked[0].map(function (d) { return d.y; }));
		
		/*var minnums = [], maxnums = [];
		this.stacked.forEach(function (section) {
			section.forEach(function (obj) {
				minnums.push(obj.x);
				maxnums.push(obj.x + obj.x0);
			});
		});

		this.xfunc.domain([0, d3.max(maxnums)]);*/
	};


	/**
	 * Draw the chart
	 */
	Likert.prototype._draw = function () {

		var margin = this.options.margin,
			height = this.options.height,
			width = this.options.width;

		// build the SVG wrapper
		this.chart = d3.select(this.options.div)
			.append('svg')
			.attr('class', 'trace-likert')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0 0 ' + width + ' ' + height)
			.attr('perserveAspectRatio', "xMinYMid")
			.append('g')
			.attr('transform', 'translate(' + margin[3] + ',' + (margin[0])+ ')');

		Trace.prototype._build.call(this);

		// wrap each of the series into a group
		this.group = this.chart.selectAll('g.trace-likertgroup')
			.data(this.stacked)
		.enter()
			.append('g')
			.attr('class', 'trace-likertgroup')
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
            .attr('class', function (d) { return 'trace-' + d.series; })
            .on('mouseover', this._mouseover.bind(this))
			.on('mouseout', this._mouseout.bind(this));
	};

	/**
	 * Build the Likert chart
	 *
	 * @private
	 */
	Likert.prototype._build = function () {
		this._calculate();
		this._draw();
	};

	return Likert;
});