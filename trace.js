/*global require: false, define: false, window: false, requirejs: true */

define(function (require) {
	'use strict';

	return {
		lineChart: require('./trace/LineChart'),
		barChart: require('./trace/BarChart'),
		pieChart: require('./trace/PieChart'),
		likert: require('./trace/Likert'),
		choropleth: require('./trace/Choropleth'),
		forceDirected: require('./trace/ForceDirected')
	};
});