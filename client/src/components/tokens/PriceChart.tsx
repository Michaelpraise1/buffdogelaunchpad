import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { ISeriesApi, UTCTimestamp, CandlestickData } from 'lightweight-charts';

interface PriceChartProps {
  trades: any[];
}

export const PriceChart: React.FC<PriceChartProps> = ({ trades }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.1)',
        timeVisible: true,
      },
      handleScroll: true,
      handleScale: true,
    };

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || trades.length === 0) return;

    // Process trades into OHLC candles (simplified 1-minute aggregation)
    const sortedTrades = [...trades].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const candleMap = new Map<number, { open: number, high: number, low: number, close: number }>();

    sortedTrades.forEach(trade => {
      const time = Math.floor(new Date(trade.createdAt).getTime() / 60000) * 60; // Round to minute
      const price = trade.priceAtTrade * 200; // Convert to USD for display (using $200 SOL price from backend)

      if (!candleMap.has(time)) {
        candleMap.set(time, { open: price, high: price, low: price, close: price });
      } else {
        const candle = candleMap.get(time)!;
        candle.high = Math.max(candle.high, price);
        candle.low = Math.min(candle.low, price);
        candle.close = price;
      }
    });

    const data: CandlestickData[] = Array.from(candleMap.entries()).map(([time, candle]) => ({
      time: time as UTCTimestamp,
      ...candle
    })).sort((a, b) => (a.time as number) - (b.time as number));

    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [trades]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};
