---
layout: post
---

{% highlight javascript %}
	var l = new Trace.lineChart({
		'div': '#line',
		'margin': [10, 10, 50, 30],
		'width': 500,
		'height': 250,
		'showpoints': false,
		'data': {
			"a": aa,
			"b": bb,
			"c": cc
		},
		'tooltips': function (e) {
			return '<strong>' + e[1] + '</strong><br/>x-axis val';
		},
		brush: function (extent) {
			console.log(extent);
		}
	});
{% endhighlight %}