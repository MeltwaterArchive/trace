/*global require: false, define: false, window: false, requirejs: true */

define([
	'./trace/LineGraph',
	'./trace/BarChart'
], function (LineGraph, BarChart) {
	'use strict';

	return {
		lineGraph: LineGraph,
		barChart: BarChart
	};
});