import React from 'react';
import "./styles.css"
import { Line, Pie } from "@ant-design/charts";
import { Transaction } from 'firebase/firestore';

const Chart = ({sortedTransactions}) => {

    const data = sortedTransactions.map((item) => {
        return {date: item.date, amount: item.amount};
    });

    const spendingData = sortedTransactions.filter((transaction) => {
        if(transaction.type=="expense"){
            return {tag: transaction.tag, amount: transaction.amount}
        }
    })

    let finalSpending = spendingData.reduce((acc, obj) => {
        let key = obj.tag;
        if(!acc[key]) {
            acc[key] = {tag: obj.tag, amount: obj.amount};
        }else {
            acc[key].amount += obj.amount;
        }
        return acc;
    }, {});

    const config = {
       data:data,
       width: 400,
       autoFit: true,
       xField: "date",
       yField: "amount",
    };
    const spendingConfig = {
       data:Object.values(finalSpending),
       width: 500,
       angleField: "amount",
       colorField: "tag"
    };
    let chart;
    let pie;

  return (
     <div className="charts-wrapper">
        <div >
           <h2 style={{marginTop: 0}}>Analytics</h2>
           <Line
              {...config}
              onReady={(chartInstance) => (chart = chartInstance)}
           />
        </div>
        <div>
           <h2 style={{marginTop: 0}}>Spendings</h2>
           <Pie
              {...spendingConfig}
              onReady={(chartInstance) => (pie = chartInstance)}
           />
        </div>
     </div>
  );
}

export default Chart