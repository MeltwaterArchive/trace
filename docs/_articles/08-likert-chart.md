---
title: Diverging Bar Chart
---

`new Trace.likert(options)`

### Options

[Please see Trace options](#options)

### Formatting the Data

The Diverging bar chart uses a slightly different format for the data object.

{% highlight javascript %}
{
	'series1': [
		'yaxis1': [1,1],
		'yaxis2': [2,2]
	],
	'series2': [
		'yaxis1': [1,1],
		'yaxis2': [2,2]
	]
}
{% endhighlight %}

<div id="likert-example"></div>

<script type="text/javascript">
	
(function () {

	var data = {
		'series1': [
			['yaxis1',1,2],
			['yaxis2',3,4]
		],
		'series2': [
			['yaxis1',5,6],
			['yaxis2',7,8]
		]
	};
	new Trace.likert({
		'div': '#likert-example',
		'data': data
	});

})();


</script>

