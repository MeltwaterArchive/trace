---
title: Bar Chart
---

`new Trace.barChart(options)`

### Options

[Please see Trace options](#options)

### Formatting the Data

The Bar Chart uses the standard model for data within Trace.

{% highlight javascript %}
{
	'series1': [[1,1],[2,2], [3,4], [4,1]],
	'series2': [[1,2],[2,1], [3,1], [4,5]]
}
{% endhighlight %}

<div id="barchart-example"></div>

<script type="text/javascript">
	
(function () {

	var data = {
		'series1': [['x1',2],['x2',1], ['x3',1], ['x4',5]],
		'series2': [['x1',1],['x2',2], ['x3',4], ['x4',1]]
	}
	new Trace.barChart({
		'div': '#barchart-example',
		'data': data,
		'width': 695,
		'legend': false,
		'height': 200
	});

})();
</script>

### Animating

To animate the Bar Chart you can pass through a new set of data to the `update` method.

{% highlight javascript %}
var data = {
	'series1': [['x1',2],['x2',1], ['x3',1], ['x4',5]],
	'series2': [['x1',1],['x2',2], ['x3',4], ['x4',1]]
}
mychart.update(data);
{% endhighlight %}

<div id="barchart-animation-example"></div>

<script type="text/javascript">
(function () {

	var rand = function () {
		var obj = {'series1': [], 'series2': []};
		Object.keys(obj).forEach(function (key) {
			for (var i = 1; i <= 4; i++) {
				obj[key].push(['x' + i, Math.round(Math.random() * 10)]);
			}
		});
		return obj;
	};

	var data = {
		'series1': [['x1',2],['x2',1], ['x3',1], ['x4',5]],
		'series2': [['x1',1],['x2',2], ['x3',4], ['x4',1]]
	};
	var chart = new Trace.barChart({
		'div': '#barchart-animation-example',
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
