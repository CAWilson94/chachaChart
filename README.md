# chachaChart

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/CAWilson94/chachaChart)

**Basic connection from websocket**

* Every update simply update state for the series required to pass to chart.
    * Flow -> websocket message -> process data -> update states for Chart component.
* Data will come in as soon as component is opened. 
    * Something to look at is how this would deal with the component being open for a while.
 
* One thing to note, this seems quite active during the day (morning hours) but evening / weekend
the data points were sparse.

***Dev Tools***

* The notes for this project mentioned a plugin to look at websockets
However I would also suggest dev tools and using network tab -
either filter on 'ws' or in this case 'bitmex' is a lot more useful
and you can see all the messages coming in etc :)

**Chart**

 * There are definitly better ways to do this and I am very aware of the repeated code - maybe we can discuss! :D . 
  * Should be able to do something similar to websocket reference like const chartRef = useRef(null);
  and then call something like this 
  ```
  chartRef.current.chart.update({
        series: [{
          data: props.updatedSeriesData, // Replace with the updated series data
        }]
```

*   to update different properties etc. I have used highcharts in angular a lot but not react yet so I think there would be equivelents of setData on the series etc. 

  * For some of this I did use the high charts ChatGPT, which we do tend to use in the office. 
  If you havent used it, it is worth a look! Although be wary, it will contradict itself and its always good to back this up with the demos they have (which are awesome) and your own tinkering etc! 
  https://www.highcharts.com/chat/gpt/
 
