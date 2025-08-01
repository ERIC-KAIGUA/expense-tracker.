import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip,Cell } from 'recharts';



const Piechart=({summaryData})=> {
  const chartData = [
    { name: 'Total Balance', value: summaryData.totalBalance },
    { name: 'Total Income', value: summaryData.totalIncome },
    { name: 'Total Expenses', value: summaryData.totalExpense },
  ];
   const COLORS = ['#77B254', '#ff9743', '#ff4d4d'];
  return (
   <div className="responsive-container">
      <PieChart width={500} height={500}>
        <Pie dataKey="value" data={chartData} nameKey="name" cx={350} cy={105} innerRadius={70} outerRadius={120} fill="#8884d8">
          {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index]} 
              />
            ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
export default Piechart