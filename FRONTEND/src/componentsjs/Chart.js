import React, { useEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import * as am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const MyAmChartsComponent = ({ result }) => {
  useEffect(() => {
    am5.ready(function () {
      // Create root element
      var root = am5.Root.new("chartdiv");

      var colorSet = am5.ColorSet.new(root, {});

      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          layout: root.verticalLayout
        })
      );

      

      chart.set(
        "scrollbarX",
        am5.Scrollbar.new(root, {
          orientation: "horizontal"
        })
      );
      
      // Assuming 'result' is an array in your React component state
const data = result.map((r, index) => ({
    no: index + 1, // Assuming you want 1-indexed numbers
    emotions: r["compound_score_sentiment"],
    emotion_score: r["compound_score"],
    polarity: r["sentiment"]["polarity"],
    subjectivity: r["sentiment"]["subjectivity"],
    strokeSettings1: {
      stroke: colorSet.getIndex(6),
    },
    strokeSettings2: {
      stroke: colorSet.getIndex(3),
    }
  }));
  
      
      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "no",
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        })
      );
      
      xAxis.data.setAll(data);
      
      var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          min: -1,
          max: 1,
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );
      
      
      // Add series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      
      var series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Sentiment",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "emotion_score",
          categoryXField: "no",
          tooltip:am5.Tooltip.new(root, {
            pointerOrientation:"horizontal",
            labelText:"{name} in {categoryX}: {valueY} {info}"
          })
        })
      );
      
      series1.columns.template.setAll({
        tooltipY: am5.percent(10),
        templateField: "columnSettings"
      });
  
      series1.bullets.push(function() {
      return am5.Bullet.new(root, {
        locationX: 0.5,
        locationY: 0.5,
        sprite: am5.Label.new(root, {
          centerY: am5.p50,
          centerX: am5.p50,
          // text: "{emotions}",
          populateText: true
        })
      });
    });
      
      series1.data.setAll(data);
      
      var series2 = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Contradiction",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "polarity",
          categoryXField: "no",
          tooltip:am5.Tooltip.new(root, {
            pointerOrientation:"horizontal",
            labelText:"{name} in {categoryX}: {valueY} {info}"
          })    
        })
      );
      
      series2.strokes.template.setAll({
        strokeWidth: 3,
        templateField: "strokeSettings1"
      });
      
      series2.data.setAll(data);
      
      series2.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            strokeWidth: 3,
            stroke: series2.get("stroke"),
            radius: 5,
            fill: root.interfaceColors.get("background")
          })
        });
      });
  
      var series3 = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: "Opinion Impact",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "subjectivity",
          categoryXField: "no",
          tooltip:am5.Tooltip.new(root, {
            pointerOrientation:"horizontal",
            labelText:"{name} in {categoryX}: {valueY} {info}"
          })    
        })
      );
      
      series3.strokes.template.setAll({
        strokeWidth: 3,
        templateField: "strokeSettings2"
      });
      
      
      series3.data.setAll(data);
      
      series3.bullets.push(function () {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            strokeWidth: 3,
            stroke: series2.get("stroke"),
            radius: 5,
            fill: root.interfaceColors.get("background")
          })
        });
      });
  
      
      chart.set("cursor", am5xy.XYCursor.new(root, {}));
      
      // Add legend
      // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );
      legend.data.setAll(chart.series.values);
   
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      chart.appear(1000, 100);
      series1.appear();
  
      // Create a second chart
      var root11 = am5.Root.new("chartdiv11");
      root11.setThemes([am5themes_Animated.new(root11)]);
      var chart11 = root11.container.children.push(am5percent.PieChart.new(root11, {
        layout: root11.verticalLayout
      }));

      var series11 = chart11.series.push(am5percent.PieSeries.new(root11, {
        valueField: "value",
        categoryField: "category"
      }));

      series11.data.setAll([
        { value: result['nof']['neg'], category: "Negative" },
        { value: result['nof']['neu'], category: "Neutral" },
        { value: result['nof']['pos'], category: "Positive" },
      ]);

      series11.appear(1000, 100);

      // Make sure to clean up when the component unmounts
      return () => {
        root.dispose();
        root11.dispose();
      };
    });
  }, [result]);

  return (
    <div>
      <div id="chartdiv" style={{ width: '100%', height: '500px' }}></div>
      <div id="chartdiv11" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default MyAmChartsComponent;
