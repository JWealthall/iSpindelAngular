import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SummaryService } from '../services/summary.service';
import { Summary } from '../models/Summary';
import { ActivatedRoute } from '@angular/router';
import { Guid } from "guid-typescript";
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  summary$: Observable<Summary>;
  batchId: Guid;
  chart: Chart;

  constructor(private summaryService: SummaryService, private avRoute: ActivatedRoute) {
    const idParam = 'id';
    if (this.avRoute.snapshot.params[idParam]) {
      this.batchId = this.avRoute.snapshot.params[idParam];
    }
  }

  ngOnInit() {
    this.loadSummary();
    // inline plugin
    this.summaryService.getBatchSummary(this.batchId).subscribe(res => {
      // Build a list of labels & datasets
      let labels = [];
      let gravities = [];
      let temperatures = [];
      res.batch.logs.forEach(log => {
        labels.push(log.date);
        gravities.push(log.gravity);
        temperatures.push(log.temperature);
      });
      this.chart = new Chart('canvas',
            {
                // The type of chart we want to create
                type: 'line',
                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Gravity',
                            yAxisID: 'y-axis-0',
                            fill: false,
                            backgroundColor: '#3366CC',
                            borderColor: '#3366CC',
                            data: gravities,
                            borderWidth: 2,
                            pointRadius: 0,
                            //trendlineLinear: {
                            //    style: "#3e95cd",
                            //    lineStyle: "line",
                            //    width: 1
                            //}
                        },
                        {
                            label: 'Temperature',
                            yAxisID: 'y-axis-1',
                            fill: false,
                            backgroundColor: '#DC3912',
                            borderColor: '#DC3912',
                            borderWidth: 2,
                            data: temperatures,
                            pointRadius: 0,
                            //trendlineLinear: {
                            //    style: "#EA8A73",
                            //    lineStyle: "line",
                            //    width: 1
                            //}
                        }
                    ]
                },

                // Configuration options go here
                options: {
                    scales: {
                        xAxes: [
                            {
                                type: 'time',
                                time: {
                                    minUnit: "day"
                                }
                            }
                        ],
                        yAxes: [
                            {
                                id: 'y-axis-0',
                                position: 'left'
                            }, {
                                id: 'y-axis-1',
                                type: 'linear',
                                position: 'right',
                                ticks: {
                                    min: 0
                                },
                                gridLines: {
                                    display: false
                                }
                            }
                        ]
                    },
                    tooltips: {
                        mode: 'index',
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return data.datasets[tooltipItem.datasetIndex].label +
                                    ': ' +
                                    data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            }
                        }
                    }
                }
            });

    });
  }

  loadSummary() {
    this.summary$ = this.summaryService.getBatchSummary(this.batchId);
  }

//  var pluginTrendlineLinear = {
//    beforeDraw: function (chartInstance) {
//        var yScale;
//        var xScale;
//        for (var axis in chartInstance.scales) {
//            if (axis[0] == 'x')
//                xScale = chartInstance.scales[axis];
//            else
//                yScale = chartInstance.scales[axis];
//            if (xScale && yScale) break;
//        }
//        var ctx = chartInstance.chart.ctx;

//        chartInstance.data.datasets.forEach(function (dataset, index) {
//            if (dataset.trendlineLinear && chartInstance.isDatasetVisible(index)) {
//                var datasetMeta = chartInstance.getDatasetMeta(index);
//                // Check if a "named" yScale is being used
//                var ySc = yScale
//                if (dataset.yAxisID !== undefined && dataset.yAxisID !== null && chartInstance.scales[dataset.yAxisID] !== undefined) {
//                    ySc = chartInstance.scales[dataset.yAxisID];
//                }
//                addFitter(datasetMeta, ctx, dataset, xScale, ySc);
//            }
//        });

//        ctx.setLineDash([]);
//    }
//};

//function addFitter(datasetMeta, ctx, dataset, xScale, yScale) {
//    var style = dataset.trendlineLinear.style || dataset.borderColor;
//    var lineWidth = dataset.trendlineLinear.width || dataset.borderWidth;
//    var lineStyle = dataset.trendlineLinear.lineStyle || "solid";

//    style = (style !== undefined) ? style : "rgba(169,169,169, .6)";
//    lineWidth = (lineWidth !== undefined) ? lineWidth : 3;

//    var fitter = new LineFitter();
//    var lastIndex = dataset.data.length - 1;
//    var startPos = datasetMeta.data[0]._model.x;
//    var endPos = datasetMeta.data[lastIndex]._model.x;

//    var xy = false;
//    if (dataset.data && typeof dataset.data[0] === 'object') xy = true;

//    dataset.data.forEach(function (data, index) {
//        if (data == null)
//            return;
//        if (xy) fitter.add(data.x, data.y);
//        else fitter.add(index, data);
//    });

//    var x1 = xScale.getPixelForValue(fitter.minx);
//    var x2 = xScale.getPixelForValue(fitter.maxx);
//    var y1 = yScale.getPixelForValue(fitter.f(fitter.minx));
//    var y2 = yScale.getPixelForValue(fitter.f(fitter.maxx));
//    if (!xy) { x1 = startPos; x2 = endPos; }

//    var drawBottom = datasetMeta.controller.chart.chartArea.bottom;
//    var chartWidth = datasetMeta.controller.chart.width;

//    if (y1 > drawBottom) { // Left side is below zero
//        var diff = y1 - drawBottom;
//        var lineHeight = y1 - y2;
//        var overlapPercentage = diff / lineHeight;
//        var addition = chartWidth * overlapPercentage;

//        y1 = drawBottom;
//        x1 = (x1 + addition);
//    } else if (y2 > drawBottom) { // right side is below zero
//        var diff = y2 - drawBottom;
//        var lineHeight = y2 - y1;
//        var overlapPercentage = diff / lineHeight;
//        var subtraction = chartWidth - (chartWidth * overlapPercentage);

//        y2 = drawBottom;
//        x2 = chartWidth - (x2 - subtraction);
//    }

//    ctx.lineWidth = lineWidth;
//    if (lineStyle === "dotted") { ctx.setLineDash([2, 3]); }
//    ctx.beginPath();
//    ctx.moveTo(x1, y1);
//    ctx.lineTo(x2, y2);
//    ctx.strokeStyle = style;
//    ctx.stroke();
//}

//function LineFitter() {
//    this.count = 0;
//    this.sumX = 0;
//    this.sumX2 = 0;
//    this.sumXY = 0;
//    this.sumY = 0;
//    this.minx = 1e100;
//    this.maxx = -1e100;
//}

//LineFitter.prototype = {
//    'add': function (x, y) {
//        this.count++;
//        this.sumX += x;
//        this.sumX2 += x * x;
//        this.sumXY += x * y;
//        this.sumY += y;
//        if (x < this.minx) this.minx = x;
//        if (x > this.maxx) this.maxx = x;
//    },
//    'f': function (x) {
//        var det = this.count * this.sumX2 - this.sumX * this.sumX;
//        var offset = (this.sumX2 * this.sumY - this.sumX * this.sumXY) / det;
//        var scale = (this.count * this.sumXY - this.sumX * this.sumY) / det;
//        return offset + x * scale;
//    }
//};
}
