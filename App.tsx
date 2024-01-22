import React, { useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import Chart from './Chart';
import './style.css';

export interface seriesData {
  timestamp: string;
  symbol: string;
  side: 'Sell' | 'Buy';
  size: number;
  price: number;
} // there are other fields but keeping this to just what we need

const url: string =
  'wss://www.bitmex.com/realtime?subscribe=trade:XBTUSD,liquidation:XBTUSD';

const App = () => {
  const connection = useRef<WebSocket | null>(null);

  const [buySeriesData, setBuySeriesData] = React.useState<seriesData[]>([]);
  const [sellSeriesData, setSellSeriesData] = React.useState<seriesData[]>([]);
  const [sizeSeriesData, setSizeSeriesData] = React.useState<seriesData[]>([]);

  const [isChartToggled, setChartToggled] = React.useState<boolean>(false);

  const createSeriesDataTrade = async (
    data: Record<string, any>
  ): Promise<seriesData> => {
    const { timestamp, symbol, side, size, price } = data;
    return { timestamp, symbol, side, size, price };
  };

  const updateSeriesData = async (trade: seriesData, side: string) => {
    const newTrade = await createSeriesDataTrade(trade);

    if (side === 'Sell') {
      setSellSeriesData((prevSellSeriesData) => [
        ...prevSellSeriesData,
        newTrade,
      ]);
    } else if (side === 'Buy') {
      setBuySeriesData((prevBuySeriesData) => [...prevBuySeriesData, newTrade]);
    }

    setSizeSeriesData((prevSizeSeriesData) => [
      ...prevSizeSeriesData,
      newTrade,
    ]);
  };

  const dataMapper = (eventData: any) => {
    if (eventData.data) {
      let data = JSON.parse(eventData.data);
      if (data.table == 'trade' && data.data[0]) {
        updateSeriesData(data.data[0], data.data[0].side);
      }
    }
  };

  useEffect(() => {
    const socket = new WebSocket(url);
    // Open Connection
    socket.addEventListener('open', (event) => {
      socket.send('Connection Established');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      dataMapper(event);
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket Error:', JSON.stringify(error));
    });

    connection.current = socket;

    return () => {
      if (connection.current.readyState == 1) {
        connection.current.close();
      }
    };
  }, []);

  return (
    <div>
      <div></div>

      {isChartToggled ? (
        <div>
          <Chart
            buySeriesData={buySeriesData}
            sellSeriesData={sellSeriesData}
            sizeSeriesData={sizeSeriesData}
          />
        </div>
      ) : null}

      <div>
        <Button
          variant="secondary"
          className="mt-3"
          size="sm"
          onClick={() => setChartToggled((prevToggled) => !prevToggled)}
        >
          Toggle Chart
        </Button>
      </div>
    </div>
  );
};

export default App;
