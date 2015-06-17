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
	 * This is highly influanced by (NVD3 Multi Bar Horizontal)[https://github.com/novus/nvd3/blob/master/src/models/multiBarHorizontal.js] 
	 * however our chart will only ever accept positive numbers.
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
			width = this.options.width,
			keys = Object.keys(this.options.data);

		// convert the data into the correct format
		this.mappedData = keys.map(function (k, i) {
			return {
				'key': k,
				'values': this.options.data[k].map(function (v) {
					return {
						'label': v[0],
						/**
						 * HACK!!!
						 *
						 * Force the value to be negative, this will force the rect to render in the
						 * negative segement, we are then going to make sure the values are always
						 * abs everywhere else.
						 */
						'value': i === 0 ? Math.abs(v[1]) *-1 : Math.abs(v[1]),
						'baseline': i === 0 ? Math.abs(v[2]) *-1 : Math.abs(v[2])
					};
				})
			};
		}.bind(this));

		// create a stack layout, define how we are getting our y value
		this.mappedData = d3.layout.stack()
			.offset('zero')
			.values(function (d) { return d.values; })
			.y(function (d) { return d.value; })
		(this.mappedData);

		// give each item a reference to it's series
		this.mappedData.forEach(function (series, i) {
			series.values.forEach(function (point) {
				point.series = i;
			});
		});

		// determine the values we are going to use for the transform
		this.mappedData[0].values.map(function (d, i) {
			var posBase = 0, 
				negBase = 0,
				posBaseLineBase = 0,
				negBaseLineBase = 0;

			this.mappedData.map(function (d) {
				var f = d.values[i];
				f.size = Math.abs(f.y);
				f.bsize = Math.abs(f.baseline);

				if (f.y < 0) {
					f.y1 = negBase - f.size;
					f.b1 = negBaseLineBase - f.bsize;
					negBase = negBase - f.size;
					negBaseLineBase = negBaseLineBase - f.bsize;
				} else {
					f.y1 = posBase;
					f.b1 = posBaseLineBase;
					posBase = posBase + f.size;
					posBaseLineBase = posBaseLineBase + f.bsize;
				}
			});
		}.bind(this));

		// flatten the data
		var seriesData = this.mappedData.map(function (d, i) {
			return d.values.map(function (d) {
				return {
					'x': d.label,
					'y': d.value,
					'y0': d.y0,
					'y1': d.y1,
					'b': d.baseline,
					'b0': d.y0,
					'b1': d.b1
				};
			});
		});

		console.log(seriesData);

		this.xfunc = d3.scale.ordinal().domain(d3.merge(seriesData).map(function (d) {
			return d.x;
		})).rangeRoundBands([0, height - margin[0] - margin[2]], 0.1);

		this.yfunc = d3.scale.linear().domain(d3.extent(d3.merge(seriesData).map(function (d) {
			if (Math.abs(d.y) > Math.abs(d.b)) {
				return d.y > 0 ? d.y1 + d.y : d.y1;
			} else {
				return d.b > 0 ? d.b1 + d.b : d.b1;
			}			
		})));

		this.yfunc.range([0, width - margin[1] - margin[3]]);
		this.y0 = d3.scale.linear().domain(this.yfunc.domain()).range([this.yfunc(0), this.yfunc(0)]);
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
			.data([this.mappedData])
			.append('svg')
			.attr('class', 'trace-likert')
			.attr('width', width)
			.attr('height', height)
			.attr('viewbox', '0 0 ' + width + ' ' + height)
			.attr('perserveAspectRatio', "xMinYMid")
			.append('g')
			.attr('transform', 'translate(' + margin[3] + ',' + (margin[0])+ ')');

		// wrap each of the series into a group
		this.group = this.chart.selectAll('g.trace-likertgroup')
			.data(function(d) { return d; }, function(d,i) { return i; })
		.enter()
			.append('g')
			.attr('class', function (d, i) { return 'trace-likertgroup-' + i; })
			.style('fill', function (d, i) { return this.colors(i); }.bind(this));

		// build a rect in each
		this.rect = this.group.selectAll('rect.y1')
			.data(function (d) {
				return d.values;
			})
		.enter()
			.append('g')
			 	.attr('transform', function (d,i,j) {
					return 'translate(' + this.yfunc(d.y1) + ',' + this.xfunc(d.label) + ')';
				}.bind(this))
				.append('rect')
					.attr('class', 'y1')
					.attr('width', function (d, i) {
						return Math.abs(this.yfunc(d.value + d.y0) - this.yfunc(d.y0));
					}.bind(this))
					.attr('height', this.xfunc.rangeBand())
					.on('mouseover', this._mouseover.bind(this))
					.on('mouseout', this._mouseout.bind(this));

		// build a baseline rect
		this.baselinerect = this.group.selectAll('rect.y2')
			.data(function (d) {
				return d.values;
			})
		.enter()
			.append('g')
			 	.attr('transform', function (d,i,j) {
					return 'translate(' + this.yfunc(d.b1) + ',' + this.xfunc(d.label) + ')';
				}.bind(this))
				.append('rect')
					.attr('opacity', 0.2)
					.attr('class', 'y2')
					.attr('width', function (d, i) {
						return Math.abs(this.yfunc(d.baseline + d.y0) - this.yfunc(d.y0));
					}.bind(this))
					.attr('height', this.xfunc.rangeBand())
					.on('mouseover', this._mouseover.bind(this))
					.on('mouseout', this._mouseout.bind(this));
			
		// lets flip the axis so we can use our parents renderer
		var tempy = this.yfunc, tempx = this.xfunc;
		this.yfunc = tempx; this.xfunc = tempy;


		// override the tickFormatter to use our function
		var tempxFormatter = this.options.xTickFormat;
		this.options.xTickFormat = function (d) {
			// turn it positive
			d = Math.abs(d);
			return tempxFormatter(d);
		};

		// render the axis and legend
		Trace.prototype._build.call(this);
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