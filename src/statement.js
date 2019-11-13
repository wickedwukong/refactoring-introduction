import {createStatementData} from "./createStatementData";

export {statement}

// plays.json
//
//   {
//       "hamlet": {"name": "Hamlet", "type": "tragedy"},
//       "as-like": {"name": "As You Like It", "type": "comedy"},
//       "othello": {"name": "Othello", "type": "tragedy"}
//   }

// invoices.json
// [
//     {
//         "customer": "BigCo",
//         "performances": [
//             {
//                 "playID": "hamlet",
//                 "audience": 55
//             },
//             {
//                 "playID": "as-like",
//                 "audience": 35
//             },
//             {
//                 "playID": "othello",
//                 "audience": 40
//             }
//         ]
//     }
// ]

// output:
//
// Statement for BigCo
//     Hamlet: $650.00 (55 seats)
// As You Like It: $580.00 (35 seats)
// Othello: $500.00 (40 seats)
// Amount owed is $1,730.00
// You earned 47 credits

function renderPlainText(statementData) {
    let result = `Statement for ${statementData.customer}\n`;

    for (let perf of statementData.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(statementData.totalAmount / 100)}\n`;
    result += `You earned ${(statementData.totalVolumeCredits)} credits\n`;
    return result;

    function usd(value) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(value);
    }
}

function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}
