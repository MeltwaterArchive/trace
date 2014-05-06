# Trace

Trace is a dynamic charting library which utilises (d3)[http://d3js.org]. It supports a wide
variety of data and is easily extenseable with new graph types.

## Usage

Include the script tag on the page.

`<script type="text/javascript" src="trace-min.js"></script>`

Trace has a hard dependecy on D3, please make sure that is loaded on the page as well. To create a new chart:

`new Trace[<Chart Type>](options)`. 


## Options
These are the default options available to each chart

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