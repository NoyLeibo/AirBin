import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ChartPie() {
  return (
    <PieChart
  series={[
    {
      data: [
        { id: 0, value: 10, label: 'Stay 1' ,color:'red'},
        { id: 1, value: 15, label: 'Stay 1' },
        { id: 2, value: 20, label: 'Stay 1' },
        { id: 3, value: 20, label: 'Stay 1' },
        { id: 4, value: 20, label: 'Stay 1' },
      ],
      highlightScope: { faded: 'global', highlighted: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
    },
  ]}
  height={200}
  width={300}
/>
  );
}

{/* <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Stay 1' ,color:'red'},
            { id: 1, value: 15, label: 'Stay 1' },
            { id: 2, value: 20, label: 'Stay 1' },
            { id: 3, value: 20, label: 'Stay 1' },
            { id: 4, value: 20, label: 'Stay 1' },
          ],
          innerRadius: 20,
      outerRadius: 90,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: 0,
      endAngle: 360,
      cx: 100,
      cy: 100,
        },
      ]}
      width={300}
      height={200}
    /> */}