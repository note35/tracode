function getUrlVars() 
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function Dstar() {
    domain_max = Math.max.apply(Math,dataset.map(function(d){return d.dstar;}));
    widthScale.domain([0, domain_max]);
    histogram.transition()
        .attr("fill", function color(d) {return colorScale(d.dstar);})
        .attr("width", function(d){ return widthScale(d.dstar); });
}

function Pass() {
    domain_max = Math.max.apply(Math,dataset.map(function(d){return d.pass;}));
    widthScale.domain([0, domain_max]);
    histogram.transition()
        .attr("fill", function color(d) {return colorScale(d.pass);})
        .attr("width", function(d){ return widthScale(d.pass); });
}

function PassF() {
    domain_max = Math.max.apply(Math,dataset.map(function(d){return d.pass_fail;}));
    widthScale.domain([0, domain_max]);
    histogram.transition()
        .attr("fill", function color(d) {return colorScale(d.pass_fail);})
        .attr("width", function(d){ return widthScale(d.pass_fail); });
}

function NotPass() {
    domain_max = Math.max.apply(Math,dataset.map(function(d){return d.npass;}));
    widthScale.domain([0, domain_max]);
    histogram.transition()
        .attr("fill", function color(d) {return colorScale(d.npass);})
        .attr("width", function(d){ return widthScale(d.npass); });
}

function NotPassF() {
    domain_max = Math.max.apply(Math,dataset.map(function(d){return d.npass_fail;}));
    widthScale.domain([0, domain_max]);
    histogram.transition()
        .attr("fill", function color(d) {return colorScale(d.npass_fail);})
        .attr("width", function(d){ return widthScale(d.npass_fail);});
}

var point = getUrlVars()["fault_id"];
var coverage_json = "static/post_process_code/coverage" + point + ".json";
var rank_json = "static/post_process_code/rank" + point + ".json";
var dataset;
var histogram;
var widthScale;
var axis;
var canvas;
var domain_max;
var range_max; 
var mscale;

d3.json(coverage_json, function(data) {
    dataset = data;
    var width = 1100;
    var text_high_light = 20;
    var height = Math.max.apply(Math,data.map(function(d){return (d.line+20)*text_high_light;}));;
    range_max = 1000;
    domain_max = Math.max.apply(Math,data.map(function(d){return d.dstar;}));

    canvas = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
    widthScale = d3.scale.linear()
        .domain([0, domain_max])
        .range([0, range_max]);
    colorScale = d3.scale.linear()
        .domain([0, domain_max])
        .range(["#FFAAFF", "#FF22AA"]);
    blackScale = d3.scale.linear()
        .domain([0, Math.sqrt(domain_max)])
        .range(["white", "#555555"]);

    histogram = canvas.selectAll("histogram")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", function(d){ return widthScale(d.dstar); })
        .attr("height", 18)
        .attr("y", function(d, i){ return i*20; })
        .attr("fill", function color(d) {return colorScale(d.dstar);})
        .on('mouseover', function(d){
            var nodeSelection = d3.select(this).style({opacity:'0.3'});
        })
        .on('click', function(d){
            var nodeSelection = d3.select(this).transition().duration(1000).style({opacity:'0.3'});
        })    
        .on('mouseout', function(d){
            var nodeSelection = d3.select(this).transition().delay(30000).style({opacity:'1.0'});
        })        
        .attr("transform", "translate(50, 139)");

    var hightlight_line = canvas.selectAll("highlight_line")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", 30)
        .attr("height", 18)
        .attr("y", function(d, i){ return i*20; })
        .attr("fill", function(d) { 
            if( d.dstar == domain_max) 
                return "black";
            else if (d.dstar != 0)
                return blackScale(d.dstar);
            else
                return "#FFFF99";
        })
        .style("stroke", "black")
        .style("stroke-width", function(d) {
            if ( d.dstar>0 )
                return 1; 
            else 
                return 0;
        })
        .attr("transform", "translate(20, 138)");

    var line = canvas.selectAll("line")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", function(d) {
            if (d.dstar == domain_max)
                return "white";
            else
                return "black";
        })
        .attr("y", function(d,i) {return i*20;})
        .text(function (d) { return d.line; })
        .attr("transform", "translate(24, 151)");

    var code = canvas.selectAll("code")
        .data(data)
        .enter()
        .append("text")
        .attr("fill", "#555")
        .attr("y", function(d,i) {return i*20;})
        .text(function (d) {return d.code; })
        .attr("transform", "translate(60, 151)");

    d3.json(rank_json, function(data2){

        var combination = [];

        data.forEach(function(record, index){
            combination[record.line] = record;
        });

        data2.forEach(function(record, index){
            for(var key in record)
            {
                 var value = record[key];
                 combination[record.line][key] = value;
            } 
        });

        var rank = canvas.selectAll("rank")
            .data(combination)
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("y", function(d,i) {return i*20;})
            .text(function (d) { 
                 return d.rank !== undefined ? d.rank : 0; 
            })
           .attr("transform", "translate(4, 231)");
    })
})


