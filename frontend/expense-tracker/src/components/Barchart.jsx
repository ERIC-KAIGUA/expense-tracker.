import React from "react";
import{BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Rectangle} from "recharts"


const Barchart = ({ data }) => {
    return(
        <ResponsiveContainer width="90%" height="100%">
          <BarChart width={600} height={300} data={data} margin={{top:20,right:20,bottom:5,left:30}}>
              <CartesianGrid stroke="#aaa" strokeDasharray="1"></CartesianGrid>
              <XAxis dataKey="name" label={{value:'Days', position:'bottom',stroke:'magenta',strokeWidth:0.5}}></XAxis>
              <YAxis width="auto" label={{value:'Income',position:'left',angle:-90,stroke:'magenta',strokeWidth:0.5}}></YAxis>
              <Legend align="right"></Legend>
              <Tooltip></Tooltip>
              <Bar dataKey="amt" fill="#9929EA" name="Amount" radius={8} activeBar={<Rectangle fill="purple" stroke="white"/>}></Bar>
          </BarChart>
       </ResponsiveContainer>
      )

}
export default Barchart