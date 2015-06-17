---
title: Introduction
---

Trace is a dynamic JavaScript charting library which utilises <a href="http://d3js.org">d3</a>. It supports a wide variety of data and is easily extensible with new graph types. Trace is less than 20kb (even smaller when gzipped).

<a class="github-button" href="https://raw.githubusercontent.com/datasift/trace/master/trace-min.js" data-style="mega" aria-label="Download ntkme/github-buttons on GitHub">Download</a>
<a class="github-button" href="https://github.com/datasift/trace" data-style="mega" aria-label="Watch datasift/trace on GitHub">Watch</a>

<!-- Place this tag right after the last button or just before your close body tag. -->
<script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>

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
  'legend': false,
  'data': {
    'series1': [[0,0],[1,2],[2,4],[3,6]]
  }
});
</script>