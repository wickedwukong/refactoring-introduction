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

function statement(invoice, plays) {
    let totalAmount = 0;
    let result = `Statement for ${invoice.customer}\n`;

    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf);
        volumeCredits += volumeCreditsFor(perf);
        // print line for this order
        result += `  ${playFor(perf).name}: ${usd(thisAmount / 100)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${usd(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

    function usd(value) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(value);
    }


    function amountFor(aPerformance) {
        let result = 0;

        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(aPerformance).type}`);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type) volumeCredits += Math.floor(aPerformance.audience / 5);
        return volumeCredits;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }


}
