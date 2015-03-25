# Trace

Trace is a dynamic JavaScript charting library which utilises [d3](http://d3js.org). It supports a wide
variety of data and is easily extensible with new graph types.

## Usage

Trace is very easy to use, it has one depency on [d3](http://d3js.org).

You can load Trace in one of two ways, firstly include the compressed `trace-min` file in your script tag. Or secondly load Trace in a AMD compatiable enviroment such as requireJs `require(['path-to-trace-min.js'], ...)`.

To create a new chart:

`new Trace[<Chart Type>](options)`

Where options is an object:

- **data**: The data you are supplying it needs to be in the format of
    `{
      <series1>: [[x,y]...],
      ...
    }`
- **width**: Width of the graph in pixels
- **height**: Height of the graph in pixels
- **tooltips**: Accepts `true` or a function to format the data
- **legend**: `true` | `false` to show/hide the legend
- **gridlines**: `true` | `false` to show/hide the horizontal gridlines
- **margin**: Margin around the graph [top, right, bottom, left] if you choose to have axis,
these values will need to be adjusted to fit in the axis values
- **colors**: An `Array` of hex colours
- **xTickFormat**: Format the ticks on the xaxis see [d3 format](https://github.com/mbostock/d3/wiki/Formatting#d3_format)
- **yTickFormat**: Format the ticks on the yaxis see [d3 format](https://github.com/mbostock/d3/wiki/Formatting#d3_format)

### Line Graph

`new Trace.lineGraph(options)`

![LineGraph](http://cl.ly/image/0z0M0T430Q2O/download/Screen%20Shot%202014-05-07%20at%2009.58.19.png)

In addition to the standard options that are available with Trace there these specific line graph options:

- **showx**: Show or hide the X axis, defaults to `true`
- **showy**: Show or hide the Y axis, defaults to `true`
- **showpoints**: Show the points on the line
- **interpolate**: Type of line interpolation (whether it's curved or straight) see https://github.com/mbostock/d3/wiki/SVG-Shapes#line_interpolate 

### Bar Chart

`new Trace.barChart(options)`

![BarChart](http://cl.ly/image/3r0a2e232W1v/download/Screen%20Shot%202014-05-07%20at%2009.58.27.png)

In addition to the standard options that are available with Trace there these specific bar chart options:

- **showx**: Show or hide the X axis, defaults to `true`
- **showy**: Show or hide the Y axis, defaults to `true`

## Updating/animating a chart

Charts can be updated using the `update` method which takes in a new data set. The chart will tween between the old and new dataset over 100 milliseconds.

    var graph = Trace.barChart({
    	data: {'Example': [[1,1], [2,2], [3,3]]}
    });

    graph.update({'Example': [[1,2], [2,3], [3,4]]})

## Formatting Tooltips

The parameter allows you to easily format the tooltips. The function is passed an arr with the first index being the `x` value and the second being the `y` value.

    new Trace.lineGraph({
      data: {'Example': [[1,1], [2,2], [3,3]]},
      tooltips: function (vals) {
    	 return 'x:' + vals[0] + ' y:' + vals[1];
      }
    });

## Formatting Axis Labels

You can format the ticks on the x and y axis by using `xTickFormat` and `yTickFormat` respectively. Please read the d3 documentation on the [format of string](https://github.com/mbostock/d3/wiki/Formatting#d3_format) also see `d3.time.format` for formatting where x or y is a time series.

## Legend

The Legend is built using standard HTML elements and is appended to your `div` after the `svg` element. This is so you are able to easily style the legend.

## Building

Trace uses Almond and r.js to build the minified file.

`node tools/r.js -o tools/build.js`