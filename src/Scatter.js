import React from 'react';
import * as d3 from 'd3';

class Scatter extends React.Component {
    constructor(props) {
        super(props);
        
        this.getData = this.getData.bind(this);
        this.addKeys = this.addKeys.bind(this);
        
        this.state = {
            data: ""
        }
    }
    
    getData() {
        let url = "a.json"

        /* JSON format
        {
            'token1': [
                {'date': '2023/01/23', 'time': '06:59:49.16595', 'value': '10'},
                {'date': '2023/01/23', 'time': '06:59:49.39341', 'value': '5000'},
                {'date': '2023/01/23', 'time': '06:59:49.39342', 'value': '-437'},
                {'date': '2023/01/23', 'time': '06:59:49.39343', 'value': '0'}
            ],
            'token2': [
                {'date': '2023/01/23', 'time': '06:59:49.16934', 'value': '100'},
                {'date': '2023/01/23', 'time': '06:59:49.76699', 'value': '200'},
                {'date': '2023/01/23', 'time': '06:59:50.51693', 'value': '300'},
                {'date': '2023/01/23', 'time': '06:59:51.26695', 'value': '400'},
                {'date': '2023/01/23', 'time': '06:59:52.17043', 'value': '500'},
                {'date': '2023/01/23', 'time': '06:59:52.76698', 'value': '600'}
            ]
        }
        */
        
        fetch(url)
            .then(response => response.json())
            .then(message => {
                       
            this.setState({
                data: message
            });
            
            this.addKeys();
        })
    }
    
  addKeys() {
    
    let dataset = this.state.data;
    
    let keys = Object.keys(dataset)
    
    
    var graphSelect = d3.select('#SelectionBox')
                          .on('change', selectionChange)
    
    function selectionChange() {
      let item = graphSelect.property('value');
      clearOldChart();
      addNewChart(dataset[item], item);
    }
    
    keys.forEach(item => {
    
      graphSelect.append('option')
        .text(item);
  
    });    
    
    
    function clearOldChart() {
      d3.selectAll("svg").remove()
    }
  
    function addNewChart(dataset, name) {
      
        let h = 400;
        let w = 800;
        let margin = 80;
      
        console.log(dataset)
  
  /*      d3.select("#ScatterPlot")
            .append("div")
            .attr("id", "tooltip")
            .style("visibility", "hidden")*/
        
        let svg = d3.select("#LogGraph")
                    .append("svg")
                    .attr("height", h)
                    .attr("width", w)
        
        let yScale = d3.scaleLinear()
                      .domain([d3.min(dataset, (d) => Number(d.value)), 
                               d3.max(dataset, (d) => Number(d.value))])
                      .range([h-margin, 0+margin]);
        let yAxis = d3.axisLeft(yScale);
  
       
        svg.append("g")
            .attr("transform","translate(" + margin + ", 0)")
            .attr("id", "y-axis")
            .call(yAxis);
        
        
        function getTime(t) {
            let h = Number(t.slice(0,2))
            let m = Number(t.slice(3,5));
            let s = Number(t.slice(6,8));
            let ms = Number(t.slice(9,12));
  
            let c = new Date();
            c.setMilliseconds(ms);
            c.setSeconds(s);        
            c.setMinutes(m);
            c.setHours(h);
  
            return c;
        }
        
        let xScale = d3.scaleTime()
                      .domain([d3.min(dataset, (d) => getTime(d.time)), 
                               d3.max(dataset, (d) => getTime(d.time))])
                      .range([0+margin, w-margin]);
  
        let xAxis = d3.axisBottom(xScale)
                      .tickFormat(d3.timeFormat("%H:%M:%S"));
      
        svg.append("g")
            .attr("transform","translate(0, " + (h-margin) + ")")
            .attr("id", "x-axis")
            .call(xAxis);
        
        
  /*   function formatLabel(d) {
        //console.log(this);
        return d.target.getAttribute("xyz");
        
    }
        
    var mouseover = function(d) {
       d3.select("#tooltip")
          .html(formatLabel(d))
          .attr("xyz", d.target.getAttribute("xyz"))
          .style("left", d3.pointer(event)[0] + 50 + "px")
          .style("top", d3.pointer(event)[1] + 100 + "px")
          .style("visibility", "visible")
  
    }
  
    var mouseleave = function(d) {
      d3.select("#tooltip")
          .style("visibility", "hidden")
    }
        
  */
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => xScale(getTime(d.time)))
            .attr("cy", (d, i) => yScale(Number(d.value)))
            .attr("r", 1)
            .attr("stroke", "red")
            //.on("mouseover", mouseover)
            //.on("mouseleave", mouseleave)
        
        svg.append("text")
            .text(name)
            .attr("x", 0)
            .attr("y", h/2)
            .attr("transform","rotate(-90 20 " + h/2 + ")")
  
    }
  }
    
    componentDidMount() {
        
        this.getData();
        
    }
    
    render() {
        return(
            <div id="LogGraph">
                <h1 id="title">Token2Log</h1>
                <h4>Parameteric Visualization</h4>
                <select id="SelectionBox" defaultValue="__DEFAULT__">
                  <option value="__DEFAULT__" disabled>Select parameter</option>
                </select>
                <div id="legend">
                    <div className="legend-name">Graph 1 <div className="legend-name" id="legend1"/></div>
                    <div className="legend-name">Graph 2 <div className="legend-name" id="legend2"/></div>
                </div>
            </div>
        );
    }
  }

  export default Scatter;