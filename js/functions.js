//Define functions
function matrix(a, b, c, d, tx, ty) {
	return d3.geo.transform({
		point: function(x, y) {
			this.stream.point(a * x + b * y + tx, c * x + d * y + ty); 
		}
	});
}

function updateColorDomain(data){
	color.domain([2.5, 5, 7.5, 10, 12.5, 15]);
	return color.domain();
}

function update(year, json, data, xScale, yScale, barHeight, barButtomPadding) {

	d3.selectAll('.selection-polygon')
			.data(json.features)
			.transition('ease')
			.duration(0)
			.attr('value', function(d){
				return d.properties[year];
			});

	d3.selectAll('.polygon')
			.data(json.features)
			.transition('ease')
			.duration(1000)
			.attr('fill', function(d){
				return color(parseFloat(d.properties[year]));
			})
			.attr('value', function(d){
				return d.properties[year];
			});

	sortLabels(data, year, xScale, yScale, 750, barHeight, barButtomPadding);
	sortBars(data, year, xScale, yScale, 750, barHeight, barButtomPadding);


	d3.select('.year')
		.remove();

	//Update the year
	d3.select('svg.banner')
		.append('text')
		.attr('class', 'year')
		.text(String(year))
		.attr('x', x/2)
		.attr('y', 130)
		.style('fill', 'rgb(253,141,60)')
		.style('font-family', 'Helvetica')
		.style('font-size', 25)
		.attr('text-anchor', 'middle');

	//Hightlight inset barplot bar for current year
	d3.select(".currentYear").classed("currentYear", false)
	d3.select('#year' + year)
		.attr('class', 'currentYear');
}

function bindingData(data, json){
	for (var i = 0; i < data.length; i++) {
		var stateAbbr = data[i].StateAbbr;
		var value2013 = parseFloat(data[i]['2013']),
			value2012 = parseFloat(data[i]['2012']),
			value2011 = parseFloat(data[i]['2011']),
			value2010 = parseFloat(data[i]['2010']),
			value2009 = parseFloat(data[i]['2009']),
			value2008 = parseFloat(data[i]['2008']);
		for (var j = 0; j < json.features.length; j++) {
			var jsonStateAbbr = json.features[j].properties.StateAbbr;
			if (stateAbbr === jsonStateAbbr) {
				json.features[j].properties['2013'] = value2013;
				json.features[j].properties['2012'] = value2012;
				json.features[j].properties['2011'] = value2011;
				json.features[j].properties['2010'] = value2010;
				json.features[j].properties['2009'] = value2009;
				json.features[j].properties['2008'] = value2008;
				break;
			}
		}
	}
}

var sortBars = function(data, year, xScale, yScale, duration, barHeight, barButtomPadding) {
	d3.selectAll('rect.bar')
	    .sort(function(a, b) {
		   return d3.ascending(parseFloat(a.properties[year]), parseFloat(b.properties[year]));
	   	})
	    .transition('ease')
	    .duration(duration)
	    .attr('x', function(d, i) {
	   		return xScale(i);
	    })
	    .attr('y', function(d) {
			return barHeight - yScale(parseFloat(d.properties[year])) - barButtomPadding;
		})
		.attr('value', function(d){
			return d.properties[year];
		})
	    .attr('height', function(d) {
	   		return yScale(parseFloat(d.properties[year]));
	    })
	    .attr('fill', function(d) {
		 	return color(parseFloat(d.properties[String(year)]));
	    });

	d3.selectAll('rect.selection-bar')
	    .sort(function(a, b) {
		   return d3.ascending(parseFloat(a.properties[year]), parseFloat(b.properties[year]));
	   	})
	    .transition('ease')
	    .duration(duration)
	    .attr('x', function(d, i) {
	   		return xScale(i);
	   	})
		.attr('value', function(d){
			return d.properties[year];
		});
};

var sortLabels = function(data, year, xScale, yScale, duration, barHeight, barButtomPadding){
	d3.selectAll('text.bar-label')
		.sort(function(a, b) {
		   return d3.ascending(parseFloat(a.properties[year]), parseFloat(b.properties[year]));
	   	})
	    .transition('ease')
	    .duration(duration)
	    .attr('x', function(d, i) {
	   		return xScale(i) + xScale.rangeBand() / 2;
	    })
	   	.attr('y', function(d) {
			return barHeight - yScale(parseFloat(d.properties[year])) - barButtomPadding + 14;
		})
	    .attr('height', function(d) {
	   		return yScale(parseFloat(d.properties[year]));
	    })
}
