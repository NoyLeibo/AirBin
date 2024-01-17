import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

const chartSetting = {
  yAxis: [
    {
      label: '',
    },
  ],
  minWidth: 300,
  height: 250,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-10px, 0)',
    },
  },
};
const dataset = [
  {
    income: 15,
    month: 'Jan',
  },
  {
    income: 60,
    month: 'Feb',
  },
  {
    income: 90,
    month: 'Apr',
  },
  {
    income: 60,
    month: 'May',
  },
  {
    income: 120,
    month: 'June',
  },
  
];

const valueFormatter = (value) => `${value}$`;

export default function ChartBar({data}) {
  return (
    <BarChart
    dataset={data}
    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
    series={[
      { dataKey: 'income',  valueFormatter ,color: '#ce2e6c' },
    ]}
    {...chartSetting}
    />
  );
}
