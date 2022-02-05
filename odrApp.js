var odrApp = new Object;

odrApp.odrs = [];

odrApp.enter = function() {
    var html = "";

    html += "<div class='row'>"
        html += "<div class='col-sm'>"
            html += '<div class="form-group">'
                html += '<label>Gain Time</label>'
                html += '<div class="input-group mb-3">'
                    html += '<input type="number" class="form-control" id="gainTime">'
                    html += '<div class="input-group-append">'
                        html += '<button class="btn btn-outline-secondary" onclick=odrApp.makeCurrent("gainTime") type="button">Now</button>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>';


        html += "<div class='col-sm'>"
            html += '<div class="form-group">'
                html += '<label>CPA Time</label>'
                html += '<div class="input-group mb-3">'
                    html += '<input type="number" class="form-control" id="cpaTime">'
                    html += '<div class="input-group-append">'
                        html += '<button class="btn btn-outline-secondary" onclick=odrApp.makeCurrent("cpaTime") type="button">Now</button>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'

        html += "<div class='col-sm'>"
            html += '<div class="form-group">'
                html += '<label>Lost Time</label>'
                html += '<div class="input-group mb-3">'
                    html += '<input type="number" class="form-control" id="lostTime">'
                    html += '<div class="input-group-append">'
                        html += '<button class="btn btn-outline-secondary" onclick=odrApp.makeCurrent("lostTime") type="button">Now</button>'
                    html += '</div>'
                html += '</div>'
            html += '</div>'
        html += '</div>'
            
    html += '</div>'

    html += "<div class='row'>"
        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>CPA Range</label>'
                html += '<input type="number" class="form-control" id="cpaRange">'
            html += '</div>'    
        html += '</div>'

        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>CPA Bearing</label>'
                html += '<input type="number" class="form-control" id="bearing">'
            html += '</div>'
        html += '</div>'

        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>CPA Speed</label>'
                html += '<input type="number" class="form-control" id="speed">'
            html += '</div>'    
        html += '</div>'
    html += '</div>'

    html += "<div class='row'>"
        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>Bearing Trend</label>'
                html += '<select class="form-control" id="bearingTrend">'
                    html += '<option value="increasing">Increasing</option>'
                    html += '<option value="decreasing">Decreasing</option>'
                html += '</select>'
            html += '</div>'
        html += '</div>'
        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>Drift Course</label>'
                html += '<input type="number" class="form-control" id="driftCourse">'
            html += '</div>'
        html += '</div>'

        html += "<div class='col'>"
            html += '<div class="form-group">'
                html += '<label>Drift Speed</label>'
                html += '<input type="number" class="form-control" id="driftSpeed">'
            html += '</div>'
        html += '</div>'
    html += '</div>'

    html += "<button class='btn btn-success' onclick='odrApp.getOdrFromUI()'>Save</button>"
    html += "<button class='btn btn-secondary ml-3' onclick='odrApp.clearUI()'>Clear</button>"

    html += "<hr>"
    $("#inputs").html(html);

    odrApp.setTimeInput("gainTime",new Date())
    odrApp.setTimeInput("cpaTime",new Date())
    odrApp.setTimeInput("lostTime",new Date())

    html = "";

    html += "<button class='btn btn-primary' onclick='odrApp.viewList()'>List</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewPlot()'>Polar Plot</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewGraphs()'>Graphs</button>";
    
    html += "<div id='odrData'>"
    html += "</div>";

    $("#displayer").html(html);
    

}

odrApp.viewGraphs = function(){
    var html = "<button class='btn btn-primary' onclick='odrApp.viewList()'>List</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewPlot()'>Polar Plot</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewGraphs()'>Graphs</button>";
    
    html += "<canvas width:500 height:500 id='odrVsSpeed'></canvas>";
    html += "<canvas width:500 height:500 id='odrDiffGraph'></canvas>";
    html += "<canvas width:500 height:500 id='odrVsTime'></canvas>";

    $("#displayer").html(html);

    odrApp.drawGraph("adjustedSpeed","overallOdr",1,2025,"Overall ODR vs Speed","Overall ODR (yds)","Speed (kts)","odrVsSpeed")
    odrApp.drawGraph("adjustedSpeed","odrDiff",1,2025,"Stern minus Bow ODR vs Speed","ODR Difference (yds)","Speed (kts)","odrDiffGraph")
    odrApp.drawGraphOverTime("overallOdr",2025,"ODR over Time","ODR (yds)","odrVsTime")
}

odrApp.clearUI = function(){
    odrApp.setTimeInput("gainTime",new Date())
    odrApp.setTimeInput("cpaTime",new Date())
    odrApp.setTimeInput("lostTime",new Date())
    $("#cpaRange").val("")
    $("#bearing").val("")
    $("#bearingTrend").val("increasing")
    $("#speed").val("")
}

odrApp.getOdrFromUI = function(){
    var gainTime = $("#gainTime")[0]._flatpickr.selectedDates[0];
    var cpaTime = $("#cpaTime")[0]._flatpickr.selectedDates[0];
    var lostTime = $("#lostTime")[0]._flatpickr.selectedDates[0];
    var cpaRange = parseFloat($("#cpaRange").val());
    var bearingTrend = $("#bearingTrend").val();
    var bearing = parseFloat($("#bearing").val());
    var speed = parseFloat($("#speed").val());
    var driftCourse = parseFloat($("#driftCourse").val()) || 0;
    var driftSpeed = parseFloat($("#driftSpeed").val()) || 0;

    odrApp.addODR(bearingTrend,bearing,gainTime,cpaTime,lostTime,cpaRange,speed,driftSpeed,driftCourse)
    odrApp.viewList();
}

odrApp.viewList = function(){
    var html = "<button class='btn btn-primary' onclick='odrApp.viewList()'>List</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewPlot()'>Polar Plot</button>";
    html += "<button class='btn btn-primary ml-3' onclick='odrApp.viewGraphs()'>Graphs</button>";
    
    html += "<table class='table table-striped mt-3'>"
        html += "<thead>"
            html += "<tr>"
                html += "<th>#</th>"
                html += "<th>Time</th>"
                html += "<th>Course</th>"
                html += "<th>Speed</th>"
                html += "<th>Bow ODR</th>"
                html += "<th>Stern ODR</th>"
                html += "<th>Overall ODR</th>"
            html += "</tr>"
        html += "</thead>"
        html += "<tbody>"
        for(var i = odrApp.odrs.length-1; i >=0 ; i--){
            var odr = odrApp.odrs[i];
            html += "<tr>"
                html += "<td>" + (i+1) + "</td>"
                html += "<td>" + flatpickr.formatDate(odr.cpa,"H:i:S") + "</td>"
                html += "<td>" + odr.adjustedCourse.toFixed(0) + "</td>"
                html += "<td>" + odr.adjustedSpeed.toFixed(1) + "</td>"
                html += "<td>" + (2025*odr.upOdr).toFixed(0) + "</td>"
                html += "<td>" + (2025*odr.downOdr).toFixed(0) + "</td>"
                html += "<td>" + (2025*(odr.downOdr+odr.upOdr)/2).toFixed(0) + "</td>"
                html += "<td><button class='btn btn-danger' onclick='odrApp.removeODR(" + i + ")'>Delete</button></td>"
            html += "</tr>"
        }
        html += "</tbody>"
    html += "</table>"
    $("#displayer").html(html);
}

odrApp.removeODR = function(index){
    odrApp.odrs.splice(index,1)
    odrApp.viewList();
}

odrApp.makeCurrent = function(id){
    $("#"+id)[0]._flatpickr.setDate(new Date())
}

odrApp.setTimeInput = function(id,val){
    $("#"+id).flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i:S",
        enableSeconds: true,
        minuteIncrement: 1,
        secondIncrement: 1,
        time_24hr: true,
        defaultDate: new Date(val),
    });

}


odrApp.addODR = function(direction,bearing,gain,cpaTime,lost,cpaRange,speed,driftSpeed,driftCourse){
    gain = new Date(gain)
    lost = new Date(lost)
    cpa = new Date(cpaTime)

    var odr = new Object;
    odr.direction = direction;
    odr.bearing = bearing;
    odr.gain = gain;
    odr.cpa = cpa;
    odr.lost = lost;
    odr.cpaRange = cpaRange;
    odr.speed = speed;
    odr.driftSpeed = driftSpeed;
    odr.driftCourse = driftCourse;

    odr.course = (3600+odr.bearing + 90)%360;
    if(odr.direction == "decreasing"){
        odr.course = (3600+odr.bearing - 90)%360;
    }

    //get cpaTime - gain in seconds
    odr.upTime = (cpa.getTime() - gain.getTime())/1000;//seconds
    odr.downTime = (lost.getTime() - cpa.getTime())/1000;//seconds
    
    //get up and down range
    odr.upRange = odr.upTime / 60 / 60 * odr.speed;//nautical miles
    odr.downRange = odr.downTime / 60 / 60 * odr.speed;//nautical miles

    odr.upOdr = Math.sqrt(odr.upRange * odr.upRange + odr.cpaRange/2025 * odr.cpaRange/2025);
    odr.downOdr = Math.sqrt(odr.downRange * odr.downRange + odr.cpaRange/2025 * odr.cpaRange/2025);
    odr.overallOdr = (odr.upOdr + odr.downOdr)/2;
    odr.odrDiff = odr.downOdr - odr.upOdr;

    //get course and speed adjusted for drift
    var relX = odr.speed * Math.sin(odr.course * Math.PI / 180);
    var relY = odr.speed * Math.cos(odr.course * Math.PI / 180);
    var relXDrift = odr.driftSpeed * Math.sin(odr.driftCourse * Math.PI / 180);
    var relYDrift = odr.driftSpeed * Math.cos(odr.driftCourse * Math.PI / 180);

    var absX = relX + relXDrift;
    var absY = relY + relYDrift;

    odr.adjustedCourse = (3600+(Math.atan2(absX,absY) * 180 / Math.PI))%360;
    odr.adjustedSpeed = Math.sqrt(absX*absX + absY*absY);

    

    var gainTrigRatio = odr.upOdr / Math.sin(Math.PI/2);
    odr.gainAoB = Math.asin((odr.cpaRange/2025) / gainTrigRatio) * 180 / Math.PI;

    var lostTrigRatio = odr.downOdr / Math.sin(Math.PI/2);
    odr.lostAoB = Math.asin((odr.cpaRange/2025) / lostTrigRatio) * 180 / Math.PI;

    if(odr.direction == "decreasing"){
        odr.gainAoB = (3600 + 360 - odr.gainAoB) % 360;
        odr.lostAoB = (3600 + 180 + odr.lostAoB) % 360;
    }
    else{
        odr.gainAoB = (3600 + 360 + odr.gainAoB) % 360;
        odr.lostAoB = (3600 + 180 - odr.lostAoB) % 360;
    }


    odrApp.odrs.push(odr);
}

//draw graph with chart.js
odrApp.drawGraph = function(xProp,yProp,xMult,yMult,title,yAxisTitle,xAxisTitle,canvasId){
    var data = [];
    for(var i = 0; i < odrApp.odrs.length; i++){
        var odr = odrApp.odrs[i];
        var x = odr[xProp];
        var y = odr[yProp];
        if(xMult != null){
            x = x * xMult;
        }
        if(yMult != null){
            y = y * yMult;
        }
        data.push({x:x,y:y});
    }
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'scatter',
        title: title,
        data: {
            datasets: [{
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 5
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    title: {
                        text: yAxisTitle,
                        display: true,
                    }
                },
                x: {
                    title: {
                        text: xAxisTitle,
                        display: true,
                    },
                }
            }
        },
    });
}


odrApp.drawGraphOverTime = function(prop,mult,title,yAxisTitle,canvasId){
    var data = [];
    for(var i = 0; i < odrApp.odrs.length; i++){
        var odr = odrApp.odrs[i];
        var y = odr[prop];
        if(mult != null){
            y = y * mult;
        }
        data.push({x:(i+1),y:y});
    }

    console.log(data)
    var ctx = document.getElementById(canvasId).getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'scatter',
        title: title,
        data: {
            datasets: [{
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 5
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                y: {
                    title: {
                        text: yAxisTitle,
                        display: true,
                    }
                },
            }
        },
    });
}