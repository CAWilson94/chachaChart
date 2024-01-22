import { seriesData } from './App';
import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import darkUnica from 'highcharts/themes/dark-unica';

interface chartSeriesData {
  buySeriesData: seriesData[];
  sellSeriesData: seriesData[];
  sizeSeriesData: seriesData[];
}

const Chart = (props: chartSeriesData) => {
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'Price Series for Buy and Sell',
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '%H:%M',
        day: '%e. %b',
        month: "%b '%y",
        year: '%Y',
      },
      title: {
        text: 'Timestamp',
      },
    },
    yAxis: [
      {
        title: {
          text: 'Price',
        },
      },
      {
        title: {
          text: 'size',
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    animation: true,
    series: [
      {
        type: 'spline',
        name: 'Sell',
        yAxis: 0,
        data: props.sellSeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.price,
        ]),
      },
      {
        type: 'spline',
        name: 'Buy',
        yAxis: 0,
        data: props.buySeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.price,
        ]),
      },
      {
        type: 'spline',
        name: 'Size',
        yAxis: 1,
        data: props.sizeSeriesData.map((dataPoint) => [
          new Date(dataPoint.timestamp).getTime(),
          dataPoint.size,
        ]),
      },
    ],
  });

  const [maxSellData, setMaxSellData] = useState<number>(0);
  const [minSellData, setMinSellData] = useState<number>(0);

  const [maxBuyData, setMaxBuyData] = useState<number>(0);
  const [minBuyData, setMinBuyData] = useState<number>(0);

  const [maxSizeData, setMaxSizeData] = useState<number>(0);
  const [minSizeData, setMinSizeData] = useState<number>(0);

  useEffect(() => {
    darkUnica(Highcharts);
  }, []);

  const updateMaxMinDataPoints = () => {
    const updateMinMax = (data, setMax, setMin) => {
      if (data.length >= 1) {
        setMax(Math.max(...data));
        setMin(Math.min(...data));
      }
    };

    updateMinMax(
      props.sellSeriesData.map((dataPoint) => dataPoint.price),
      setMaxSellData,
      setMinSellData
    );

    updateMinMax(
      props.buySeriesData.map((dataPoint) => dataPoint.price),
      setMaxBuyData,
      setMinBuyData
    );

    updateMinMax(
      props.sizeSeriesData.map((dataPoint) => dataPoint.size),
      setMaxSizeData,
      setMinSizeData
    );
  };

  useEffect(() => {
    updateMaxMinDataPoints();
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          type: 'spline',
          name: 'Sell',
          yAxis: 0,
          data: props.sellSeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.price,
          ]),
        },
        {
          type: 'spline',
          name: 'Buy',
          yAxis: 0,
          data: props.buySeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.price,
          ]),
        },
        {
          type: 'spline',
          name: 'Size',
          yAxis: 1,
          data: props.sizeSeriesData.map((dataPoint) => [
            new Date(dataPoint.timestamp).getTime(),
            dataPoint.size,
          ]),
        },
      ],
      subtitle: {
        text: `Min Sell: ${minSellData} Max Sell: ${maxSellData} <br> Min Buy: ${minBuyData} Max Buy: ${maxBuyData} <br> Min Size: ${minSizeData} Max Size: ${maxSizeData} `,
        align: 'left',
        verticalAlign: 'top',
        y: 15,
      },
    }));
  }, [
    props.sellSeriesData,
    props.buySeriesData,
    props.sizeSeriesData,
    minSellData,
    maxSellData,
    minBuyData,
    maxBuyData,
    minSizeData,
    maxSizeData,
  ]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default Chart;

/** 
 * There are definitly better ways to do this and I am very aware of the repeated code - maybe we can discuss! :D . 
 * Should be able to do something similar to websocket reference like const chartRef = useRef(null);
 * and then call something like this 
 * 
 *  chartRef.current.chart.update({
        series: [{
          data: props.updatedSeriesData, // Replace with the updated series data
        }]

  to update different properties etc. I have used highcharts in angular a lot but not react yet so I think there would be equivelents of setData on the series etc. 

  For some of this I did use the high charts ChatGPT, which we do tend to use in the office. 
  If you havent used it, it is worth a look! Although be wary, it will contradict itself and its always good to back this up with the demos they have (which are awesome) and your own tinkering etc! 
  https://www.highcharts.com/chat/gpt/
 */
