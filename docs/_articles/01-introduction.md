---
title: Introduction
---

Trace is a dynamic JavaScript charting library which utilises <a href="http://d3js.org">d3</a>. It supports a wide variety of data and is easily extensible with new graph types.

##tldr;

Download the trace-min.js reference this together with <a href="http://d3js.org">d3</a> in your `<head>` section. 

{% highlight html %}
<!-- D3 loaded from CDN recommended by d3js.org -->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" charset="utf-8"></script>
<script type="text/javascript" src="trace-min.js"></script>
{% endhighlight %}

Create a `div` with an ID of `mychart`. The following script will help to get you started, this will create a simple line chart.

{% highlight javascript %}
new Trace.lineChart({
  'div': '#mychart',
  'data': {
    'series1': [[0,0],[1,2],[2,4],[3,6]]
  }
});
{% endhighlight %}

It should roughly look like the following, if it doesn't take a look at our [FAQ](#faq)

<div id="mychart"></div>
<script type="text/javascript">
new Trace.lineChart({
  'div': '#mychart',
  'width': 695,
  'height': 200,
  'data': {
    'series1': [[0,0],[1,2],[2,4],[3,6]]
  }
});
</script>