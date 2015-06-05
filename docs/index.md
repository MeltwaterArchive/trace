---
layout: default
---



<div id="lineChart">
</div>

<script type="text/javascript">
  var r = new Random();

  var chart = new Trace.lineChart({
    'div': '#lineChart',
    'width': 500,
    'height': 250,
    'data': {
      'a': r.getSeries()
    }
  });

  setInterval(function () {
    chart.update({
      'a': r.getSeries()
    });
  }, 500);


</script>

Trace is a dynamic JavaScript charting library which utilises <a href="http://d3js.org">d3</a>. It supports a wide variety of data and is easily extensible with new graph types.

##Getting Started

##Examples

<ul class="post-list">
    {% for post in site.categories.examples %}
        <li>
            <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </li>
    {% endfor %}
</ul>