/*global require: false, define: false, window: false, requirejs: true */

define(function (require) {
	'use strict';

	return {
		lineGraph: require('./trace/LineGraph'),
		barChart: require('./trace/BarChart'),
		pieChart: require('./trace/PieChart')
	};
});