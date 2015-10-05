# Trace

Trace is a dynamic JavaScript charting library which utilises [d3](http://d3js.org). It supports a wide
variety of data and is easily extensible with new graph types.

## Quick start

Several quick start options are available:

- [Download the latest release](https://github.com/datasift/trace/releases).
- Clone the repo: `git clone https://github.com/datasift/trace.git`.
- Install with [npm](https://www.npmjs.com): `npm install datasift-trace`.

## Usage

Trace is very easy to use, it has one depency on [d3](http://d3js.org). The `d3` object needs to be visble to the library, if you using requirejs you can do this by setting the paths e.g.:

    requirejs.config({
        paths: {
          'd3': '<path to d3>'
        }
    });

You can load Trace in one of two ways, firstly include the compressed `trace-min` file in your script tag. Or secondly load Trace in a AMD compatiable enviroment such as requireJs `require(['path-to-trace-min.js'], ...)`.

To create a new chart:

`new Trace[<Chart Type>](options)`

Where options is an object:

- **div**: The element to render the chart within
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

### Data Formatting

Most of the errors which are seen through trace and via correct data formatting. Each of the charts takes the same data format which is one of the benefits of Trace. The data format is the following:

    {
      <series1>: [[x,y]...],
      ...
    }

Where `series1` is the name of the current series. This will appear on the legend and is most useful for stacked bar charts. Each series needs to contain an array of arrays. Each one consisting of the x value and the y value. If you would like date formatting you can pass in a unix timestamp to the x parameters (see the examples for more information).


### Line Graph

`new Trace.lineChart(options)`

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

### Pie Chart

`new Trace.pieChart(options)`

![PieChart](http://cl.ly/image/383F1m3b3a1B/Screen%20Shot%202015-06-01%20at%2015.19.41.png)

This supports the standard set of options.

### Other Chart Types

To use these other types you will have to manually include them in your project. They do not support the full feature set and are currently undocument/tested.

- Choropleth (undocumented)
- ForceDirected (undocumented)
- Likert (in development)

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

### Updating documentation

The documentation is built using Jekyll.

`git subtree push --prefix docs origin gh-pages`
