import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip} from "recharts";

const Linechart = ({data}) =>{
    return(
        <ResponsiveContainer width="90%" height="100%">
                <LineChart width={600} height={300} data={data}  margin={{top:20,right:20,bottom:5,left:20}}>
                        <Line dataKey="amt" type="monotone" stroke="purple" strokeWidth="2" name="Amount" position="bottom-right"></Line>
                        <CartesianGrid  stroke="#aaa" strokeDasharray="5 5"></CartesianGrid>
                        <XAxis dataKey="name" label={{value:'Days', position:'bottom',stroke:'magenta',strokeWidth:0.5}}></XAxis>
                        <YAxis width="auto" label={{value: 'Expense',position:'left',angle:-90,stroke:'magenta',strokeWidth:0.5}}></YAxis>
                        <Legend align="right"></Legend>
                        <Tooltip></Tooltip>
                </LineChart>
        </ResponsiveContainer>
       
    )
}
export default Linechart