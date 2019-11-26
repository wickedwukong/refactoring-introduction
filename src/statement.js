export {statement}

// plays.json…
//
//   {
//       "hamlet": {"name": "Hamlet", "type": "tragedy"},
//       "as-like": {"name": "As You Like It", "type": "comedy"},
//       "othello": {"name": "Othello", "type": "tragedy"}
//   }

// invoices.json…

// // [
//     {
//         "customer": "BigCo",
//         "performances": [
//             {
//                 "playID": "hamlet",
//                 "audience": 55,
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

// output

// Statement for BigCo
//     Hamlet: $650.00 (55 seats)
// As You Like It: $580.00 (35 seats)
// Othello: $500.00 (40 seats)
// Amount owed is $1,730.00
// You earned 47 credits

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;

    for (let perf of data.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount / 100)}\n`;
    result += `You earned ${(totalVolumeCredits())} credits\n`;
    return result;

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
    }

    function usd(value) {
        const format = new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format;
        return format(value);
    }
}

function statement(invoice, plays) {
    const statementDate = {};
    statementDate.customer = invoice.customer;
    statementDate.performances = invoice.performances.map(enhancePerformance);
    statementDate.totalAmount = totalAmount(statementDate);

    return renderPlainText(statementDate);

    function totalAmount(data) {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }


    function enhancePerformance(aPerformance) {
        const performance = Object.assign({}, aPerformance);
        performance.play = playFor(performance);
        performance.amount = amountFor(performance);
        performance.volumeCredits = volumeCreditsFor(performance);
        return performance
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }


    function amountFor(aPerformance) {
        let result = 0;

        switch (aPerformance.play.type) {
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
                throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }

}
