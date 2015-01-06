/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3',
	'topojson',
	'./base',
	'world'
], function (d3, topojson, Trace, world) {

	'use strict';

	/**
	 * # Choropleth
	 * Builds a shaded map. See http://en.wikipedia.org/wiki/Choropleth_map for more information on
	 * what a choropleth is.
	 *
	 * ## Usage
	 * `new Trace.choropleth(options)`
	 *
	 * ## Options
	 * - `projection`: Choose a projection from the list https://github.com/mbostock/d3/wiki/Geo-Projections
	 * - `mapping`: A json file which contains the SVG path for the map you want to use.
	 * 
	 * @class  Choropleth
	 * @constructor
	 * 
	 * @param {[type]} options [description]
	 */
	var Choropleth = function (options) {
		Trace.call(this);

		this._extend(this.options, {
			'projection': 'mercator',
			'mapping': world,
			'colors': ['#EAA669', '#E67E22', '#B3621A', '#66482E', '#66380F']
		}, options);

		this._build();
	};

	/**
	 * Extends the Trace base library
	 * @extends {Trace}
	 * @type {Trace}
	 */
	Choropleth.prototype = Object.create(Trace.prototype);
	Choropleth.prototype.constructor = Choropleth;


	/**
	 * Calculate the domains/ranges for the choropleth
	 *
	 * We use the getExtremes method to find the max and min for each of the dimensions, check
	 * to see if its a date using `toString` if it is use a time scale otherwise use a linear
	 * scale.
	 *
	 * @private
	 */
	Choropleth.prototype._calculate = function () {

		var comparator = [];

		this.map = d3.map();

		Object.keys(this.options.data).forEach(function (key) {
			comparator.push(this.options.data[key]);
			this.map.set(key.toLowerCase(), this.options.data[key]);
		}.bind(this));

		var max = d3.max(comparator),
			min = d3.min(comparator);

		this.scale = d3.scale.quantize()
			.domain([min, max])
			.range(d3.range(this.options.colors.length).map(function (i) { return this.colors(i); }.bind(this)));
	};

	/**
	 * Build the line graph
	 *
	 * @private
	 * 
	 * @return {[type]} [description]
	 */
	Choropleth.prototype._build = function () {
		
		this._calculate();

		var projection = d3.geo[this.options.projection]()
			.scale((this.options.width + 1) / 2 / Math.PI)
			.translate([this.options.width / 2, this.options.height / 2])
			.precision(0.1);

		var path = d3.geo.path()
			.projection(projection);

		var svg = d3.select(this.options.div)
			.append('svg')
			.attr('width', this.options.width)
			.attr('height', this.options.height);

		svg.selectAll('path')
			.data(world.features)
			.attr('class', 'countries')
		.enter()
			.append('path')
			.attr('d', path)
			.attr('fill', function (d) { 
				return this.scale(this.map.get(d.properties.name.toLowerCase())); 
			}.bind(this));

	};

	return Choropleth;
}); 
