---
title: Line Chart
---

The line chart is useful when you have a continuous set of data.

`new Trace.lineChart(options)`

### Options

|Name|Type|Default|Description|
|----|----|--------|-----------|
|showpoints|`boolean`|true|Show dots for each of the points of data
|interpolate|`string`|linear|The interpolation between the points. See [line.interpolate](https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate) for more options|
|brush|`function`|false|Using the brush will let you drag a rectangle over the chart

[Please see Trace options](#options)

### Formatting the Data

The line chart uses the standard model for data within Trace.

{% highlight javascript %}
{
	'series1': [[1,1],[2,2], [3,4], [4,1]],
	'series2': [[1,2],[2,1], [3,1], [4,5]]
}
{% endhighlight %}

<div id="linechart-example"></div>

<script type="text/javascript">
	
(function () {

	var data = {
		'series1': [[1,1],[2,2], [3,4], [4,1]],
		'series2': [[1,2],[2,1], [3,1], [4,5]]
	}
	new Trace.lineChart({
		'div': '#linechart-example',
		'data': data,
		'width': 695,
		'legend': false,
		'height': 200
	});

})();
</script>

### Animating

To animate the Line Chart you can pass through a new set of data to the `update` method.

{% highlight javascript %}
var data = {
	'series1': [[1,2],[2,1], [3,1], [4,5]],
	'series2': [[1,1],[2,2], [3,4], [4,1]]
}
mychart.update(data);
{% endhighlight %}

<div id="linechart-animation-example"></div>

<script type="text/javascript">
(function () {

	var rand = function () {
		var obj = {'series1': [], 'series2': []};
		Object.keys(obj).forEach(function (key) {
			for (var i = 1; i <= 4; i++) {
				obj[key].push([i, Math.round(Math.random() * 10)]);
			}
		});
		return obj;
	};

	var data = {
		'series1': [[1,1],[2,2], [3,4], [4,1]],
		'series2': [[1,2],[2,1], [3,1], [4,5]]
	};
	var chart = new Trace.lineChart({
		'div': '#linechart-animation-example',
		'data': data,
		'width': 695,
		'legend': false,
		'height': 200
	});

	setInterval(function () {
		chart.update(rand());
	}, 1000);

})();
</script>
