import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ChartPie({data}) {
  console.log(data,'pie data');
  return (
    <PieChart
  series={[
    {
      data: data,
      highlightScope: { faded: 'global', highlighted: 'item' },
      faded: { innerRadius: 30, additionalRadius: -30, color:'gray' },
      innerRadius: 25,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -90,
      endAngle: 180,
      cx: 150,
      cy:100,
    },
  ]}
  slotProps={{ legend: { hidden: true } }}
  height={250}
  width={300}
/>
  )
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