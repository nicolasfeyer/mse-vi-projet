<template>
  
  <div id="my_dataviz"></div>
  
</template>

<script>

import * as d3 from 'd3'

export default {
    
    props: ['data', 'year'],

    

    data: () => ({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
        
    }),

    watch: { 
        year: function(){ // watch it
            this.drawGraph();
        }
    },


    //source : https://github.com/holtzy/D3-graph-gallery
    mounted() {
        this.drawGraph();
    },

    methods: {
        drawGraph() {
            let localData = this.data
            let locData = []
            for(let element in localData[this.year]) {
                if (localData[this.year][element]['country'] != "World" && 
                    localData[this.year][element]['pop_density'] && 
                    localData[this.year][element]['migration_perc']){
                    locData.push(localData[this.year][element]) 
                    console.log(localData[this.year][element])
                }
            }
            let margin = {top: 80, right: 150, bottom: 180, left: 80}
            let width = this.windowWidth - margin.left - margin.right
            let height = this.windowHeight - margin.top - margin.bottom
            d3.select("#my_dataviz").select("svg").remove();
            let svg = d3.select("#my_dataviz")
                .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`)
                    //Read the data
            //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv").then( function(data) {
            
            // ---------------------------//
            //       AXIS  AND SCALE      //
            // ---------------------------//
                
            // Add X axis
            const x = d3.scaleLog()
                .domain([0.8, 20000])
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x).ticks(4));
            
            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height+50 )
                .text("Population density");

            // Add Y axis
            const y = d3.scalePow()
                .exponent(0.3)
                //.domain([-0.2, 0.2])
                .domain([-9000000, 9000000])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y).ticks(16));
            
            // Add Y axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", 0)
                .attr("y", -20 )
                .text("Net migration")
                .attr("text-anchor", "start")
            
            // Add a scale for bubble size
            const z = d3.scaleSqrt()
                .domain([200000, 1310000000])
                .range([ 2, 30]);
            
            // Add a scale for bubble color
            const myColor = d3.scaleOrdinal()
                .domain(["Low income", "Lower middle income", "Upper middle income", "High income"])
                .range(["#bf4040", "#bf9540", "#bfbf40", "#6abf40"]);
                //.range(d3.schemeSet1);
            
            
            // ---------------------------//
            //      TOOLTIP               //
            // ---------------------------//
            
            // -1- Create a tooltip div that is hidden by default:
            const tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")
            
            // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
            const showTooltip = function(event,d) {
                tooltip
                .transition()
                .duration(200)
                tooltip
                .style("opacity", 1)
                .html(d.country)
                .style("left", (event.x)-50 + "px")
                .style("top", (event.y)-50 + "px")
            }
            // eslint-disable-next-line no-unused-vars
            const moveTooltip = function(event, d) {
                tooltip
                .style("left", (event.x)-50 + "px")
                .style("top", (event.y)-50 + "px")
            }
            // eslint-disable-next-line no-unused-vars
            const hideTooltip = function(event, d) {
                tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
            }
            
            
            // ---------------------------//
            //       CIRCLES              //
            // ---------------------------//
            
            // Add dots
            svg.append('g')
                .selectAll("dot")
                .data(locData)
                .join("circle")
                .attr("class", function(d) { return "bubbles " + d.incomeLevel })
                .attr("cx", d => x(d.pop_density))
                .attr("cy", d => y(d.net_migration))
                .attr("r", d => z(d.population))
                .style("fill", d => myColor(d.incomeLevel))
                // -3- Trigger the functions for hover
                .on("mouseover", showTooltip )
                .on("mousemove", moveTooltip )
                .on("mouseleave", hideTooltip )
            
            
            
                // ---------------------------//
                //       LEGEND              //
                // ---------------------------//
            
                // Add legend: circles
                const valuesToShow = [10000000, 100000000, 1000000000]
                const xCircle = this.windowWidth -310
                const xLabel = this.windowWidth -260
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("circle")
                    .attr("cx", xCircle)
                    .attr("cy", d => height - 100 - z(d))
                    .attr("r", d => z(d))
                    .style("fill", "none")
                    .attr("stroke", "black")
            
                // Add legend: segments
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("line")
                    .attr('x1', d => xCircle + z(d))
                    .attr('x2', xLabel)
                    .attr('y1', d => height - 100 - z(d))
                    .attr('y2', d => height - 100 - z(d))
                    .attr('stroke', 'black')
                    .style('stroke-dasharray', ('2,2'))
            
                // Add legend: labels
                svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("text")
                    .attr('x', xLabel)
                    .attr('y', d => height - 100 - z(d))
                    .text( d => d/1000000)
                    .style("font-size", 10)
                    .attr('alignment-baseline', 'middle')
            
                // Legend title
                svg.append("text")
                .attr('x', xCircle)
                .attr("y", height - 100 +30)
                .text("Population (M)")
                .attr("text-anchor", "middle")
            
                // Add one dot in the legend for each name.
                const size = 20
                const allgroups = ["Low income", "Lower middle income", "Upper middle income", "High income"]
                svg.selectAll("myrect")
                .data(allgroups)
                .join("circle")
                    .attr("cx", this.windowWidth -310)
                    .attr("cy", (d,i) => 10 + i*(size+5)) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("r", 7)
                    .style("fill", d =>  myColor(d))
            
                // Add labels beside legend dots
                svg.selectAll("mylabels")
                .data(allgroups)
                .enter()
                .append("text")
                    .attr("x", this.windowWidth -310 + size*.8)
                    .attr("y", (d,i) =>  i * (size + 5) + (size/2)) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", d => myColor(d))
                    .text(d => d)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
            //})
        }
    }
};
</script>

<style>
  .bubbles {
    stroke-width: 1px;
    stroke: black;
    opacity: .8
  }
  .bubbles:hover {
    stroke: black;
  }
</style>