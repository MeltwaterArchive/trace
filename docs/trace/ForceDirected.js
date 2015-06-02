/*global require: false, define: false, window: false, requirejs: true, toString: true */

define([
	'd3',
	'./base'
], function (d3, Trace) {

	'use strict';

	var ForceDirected = function (options) {
		Trace.call(this);

		this._extend(this.options, {
			charge: -120,
			linkDistance: 30
		}, options);

		if (this.options.zoom) {
			this._zoom();
		}

		this._draw();
	};

	ForceDirected.prototype = Object.create(Trace.prototype);
	ForceDirected.prototype.constructor = ForceDirected;

	ForceDirected.prototype._collide = function (alpha) {
		var quadtree = d3.geom.quadtree(this.options.data.nodes);
		
		return function(d) {
			var rb = 2*20 + 1,
				nx1 = d.x - rb,
				nx2 = d.x + rb,
				ny1 = d.y - rb,
				ny2 = d.y + rb;
		
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
						y = d.y - quad.point.y,
						l = Math.sqrt(x * x + y * y);
			
					if (l < rb) {
						l = (l - rb) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	};

	ForceDirected.prototype._draw = function () {
		var force = d3.layout.force()
			.charge(this.options.charge)
			.linkDistance(this.options.linkDistance)
			.size([this.options.width, this.options.height]);

		this.svg = d3.select(this.options.div)
			.append('svg')
			.attr('width', this.options.width)
			.attr('height', this.options.height)
			.append('g')
				.call(this.zoom)
				.append('g');


		var container = this.svg;


		/*var container = this.svg;

		if (this.options.zoom) {
			container = this.svg.append('g').
		}*/

		container.append("rect")
			.attr("class", "overlay")
			.attr("width", this.options.width)
			.attr("height", this.options.height)
			.style('fill', 'white');

		force.nodes(this.options.data.nodes)
			.links(this.options.data.links)
			.start();

		var link = container.selectAll('.link')
			.data(this.options.data.links)
			.enter()
				.append('line')
				.attr('class', 'link')
				.style('stroke-width', function (d) { return Math.sqrt(d.value); });

		var node = container.selectAll('.node')
			.data(this.options.data.nodes)
			.enter()
				.append('g')
				.attr('class', 'node')
				.call(force.drag);

		node.append('circle')
			.attr('r', 5)
			.style('fill', function (d) { return this.colors(d.group); }.bind(this));

		node.append('text')
			.attr("x", 12)
   			.attr("dy", ".35em")
			.text(function (d) { console.log(d.meta.name); return d.meta.name; });

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node.attr("transform", function(d) { 
  	    		return "translate(" + d.x + "," + d.y + ")"; 
  	    	});

  	    	node.each(this._collide(0.5));
		}.bind(this));
	};

	return ForceDirected;
});