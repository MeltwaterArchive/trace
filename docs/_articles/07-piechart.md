---
title: Pie Chart
---

`new Trace.pieChart(options)`

### Options

[Please see Trace options](#options)

### Formatting the Data

The Pie Chart uses a slightly different format of data. Please be aware that the Pie Chart will sort the data largest -> smallest clockwise around the pie.

{% highlight javascript %}
{
	'Male': 1,
	'Female': 2,
	'Unknown': 3
}
{% endhighlight %}

<div id="piechart-example" style="margin: 0 197px;"></div>

<script type="text/javascript">
	
(function () {

	var data = {
		'Male': 1,
		'Female': 2,
		'Unknown': 3
	}
	new Trace.pieChart({
		'div': '#piechart-example',
		'data': data,
		'width': 300,
		'legend': false,
		'height': 300
	});

})();
</script>

### Animating

To animate the Pie Chart you can pass through a new set of data to the `update` method.

{% highlight javascript %}
var data = {
	'Male': 3,
	'Female': 2,
	'Unknown': 1
};
mychart.update(data);
{% endhighlight %}

<div id="piechart-animation-example" style="margin: 0 197px;"></div>

<script type="text/javascript">
(function () {

	var rand = function () {
		var obj = {'male': 0, 'female': 0, 'unknown': 0};
		Object.keys(obj).forEach(function (key) {
			obj[key] = Math.round(Math.random() * 10) + 1;
		});
		return obj;
	};

	var data = {
		'Male': 3,
		'Female': 2,
		'Unknown': 1
	};
	var chart = new Trace.pieChart({
		'div': '#piechart-animation-example',
		'data': data,
		'width': 300,
		'legend': false,
		'height': 300
	});

	setInterval(function () {
		chart.update(rand());
	}, 1000);

})();
</script>
