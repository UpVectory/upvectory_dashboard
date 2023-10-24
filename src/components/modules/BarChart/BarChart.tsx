import React from 'react';
import { useContext, useEffect, useRef, useState} from 'react';
import { clsx } from 'clsx';

import { BarChartType, MyGlobalContext } from "../../base/ctxProvider/context";

import "./BarChart.scss"; 

const rangeInervalQty = 8;

type BarChartProps = {
    data : BarChartType[]
}

export const BarChart = ({ data }: BarChartProps) => {
  const chartRow = useRef<HTMLDivElement | null>(null);
  const [chartRowHeight, setChartRowHeight] = useState<number>(0);
  const { weight } = useContext(MyGlobalContext);

  // get emission in kg

  const dataWorking
    = weight === 'kg'
      ? [...data]
      : [...data].map(item => {
        return {
          ...item,
          carbon: item.carbon * 2.20462,
        }
      });

  
  const maxCarbonEmissionItem
    = dataWorking.reduce((acc, item) => item.carbon > acc.carbon ? item : acc);
  
  const totalCarbonEmission = Math.ceil(dataWorking.reduce((acc, item) => item.carbon + acc, 0));
  
  const chart = Array(rangeInervalQty + 1).fill(0).map((_, index) => {
    const maxCarbonValue = maxCarbonEmissionItem.carbon || 100; // max value will 100 by default
    const interval = Math.ceil(maxCarbonValue / rangeInervalQty);

    if (index === rangeInervalQty) {
      return Math.ceil(maxCarbonValue);
    }

    return index * interval;
  });

  useEffect(() => {
    if (chartRow.current) {
      setChartRowHeight(chartRow.current.clientHeight);
    }
  }, [])

  return (
    <div className="barchart">
      <h3 className="barchart__title">
      Your carbon emission per flight
      </h3>
      <div className="barchart__graph">
        <div className="barchart__y">
          <div className="barchart__y-values">
            {chart.map((intervalPoint, index) => (
              <div
                key={intervalPoint}
                className="barchart__y-value"
                style={{
                  order: -index
                }}
              >
                {intervalPoint}
              </div>
              ))}
          </div>

          <div className="barchart__y-field">
            {chart.map((_, index) => (
              <div
                key={index}
                className="barchart__y-line"
                ref={element => {
                  if (index === chart.length - 1) {
                    chartRow.current = element
                  }
                }}
              ></div>
            ))}
            <div className="barchart__bars">
              {dataWorking.map(dataItem => (
                <li
                  key={dataItem.id}
                  className="barchart__bar"
                  style={{
                    width: `calc(${100 / data.length}% - 5px)`,
                  }}
                >
                  <div
                    className={clsx(
                      'barchart__bar-bg',
                      dataItem.carbon > 0 && 'active',
                    )}
                    style={{
                      height: `${Math.floor(dataItem.carbon / maxCarbonEmissionItem.carbon * 100) || 1}%`,
                      maxHeight: `calc(100% - ${chartRowHeight}px)`
                    }}
                  ></div>

                  <div className="barchart__bar-value">
                    {dataItem.id < 10
                      ? String(dataItem.id + 1).padStart(2, '0')
                      : dataItem.id + 1
                    }
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="barchart__label">
        Your carbon emission is {totalCarbonEmission} {weight === 'kg' ? 'kg' : 'lb'}
      </p>
    </div>
  )
}
