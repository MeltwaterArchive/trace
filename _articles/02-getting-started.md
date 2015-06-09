---
title: Getting Started
---

###Chart Types

<ul class="chart-types">
	<li>
		<div id="type-linechart"></div>
		<a class="title" href="line-chart">Line Chart</a>
	</li>
	<li>
		<div id="type-barchart"></div>
		<a class="title" href="bar-chart">Bar Chart</a>
	</li>
	<li>
		<div id="type-piechart"></div>
		<a class="title" href="pie-chart">Pie Chart</a>
	</li>
	<li>
		<div id="type-likertchart"></div>
		<a class="title" href="#divergin-bar-chart">Diverging Bar Chart</a>
	</li>
</ul>

<script type="text/javascript">
	(function () {
		var data = {
			'a': [[0,0],[1,1],[2,2]],
			'b': [[0,5],[1,6],[2,7]],
			'c': [[0,10],[1,11],[2,12]]
		};

		var pieData = {
			'a': 1,
			'b': 2,
			'c': 3
		};

		var likertData = {
			'male': [
				['25-34', 1, 21],
				['35-44', 2, 22],
				['18-24', 3, 23],
				['45-54', 4, 3],
				['55-64', 5, 25],
				['65+', 6, 26]
			],
			'female': [
				['25-34', 1, 11],
				['35-44', 2, 12],
				['18-24', 3, 13],
				['45-54', 4, 14],
				['55-64', 5, 15],
				['65+', 6, 16]
			]
		}

		var options = {
			legend: false,
			data: data,
			width: 305,
			height: 150,
			tooltips: false
		};

		options.div = '#type-linechart';
		new Trace.lineChart(options);
		options.div = '#type-barchart';
		new Trace.barChart(options);
		options.div = '#type-piechart';
		options.data = pieData;
		new Trace.pieChart(options);
		options.div = '#type-likertchart';
		options.data = likertData;
		new Trace.likert(options);
	})();
</script>

###Options

|Name|Type|Default|Description|
|----|----|--------|-----------|
|**div**|`string`||A CSS selector string to the containing element you would like to be populated with a chart|
|**data**|`object`||An object containing the formatted data, please see the section on [formatting](#formatting) for more information|
|width|`int`|500|Width in Pixels|
|height|`int`|500|Height in Pixels|
|legend|`boolean`|true|Show or hide the legend|
|margin|`array`|[20,20,20,20]|The margin around the graph [top, left, bottom, right], this is the negative space needed for labels|
|xTickCount|`int`|5|The number of ticks to be shown on the x axis
|yTickCount|`int`|5|The number of ticks to be shown on the y axis
|xTickFormat|`function`||Alter the output of the labels on the x axis
|yTickFormat|`function`||Alter the output of the labels on the y axis
|tooltips|`function`||Show, hide or format the tooltips, these require CSS styling in order to be seen
|colors|`array`||An Array of hex color codes