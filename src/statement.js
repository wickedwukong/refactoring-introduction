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

// output

// Statement for BigCo
//     Hamlet: $650.00 (55 seats)
// As You Like It: $580.00 (35 seats)
// Othello: $500.00 (40 seats)
// Amount owed is $1,730.00
// You earned 47 credits

function statement (invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(perf) {
        let volumeCredits = 0;
        volumeCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
    }

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        // print line for this order
        result += `  ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;

    function amountFor(perf) {
        let thisAmount = 0;

        switch (playFor(perf).type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(perf).type}`);
        }
        return thisAmount;
    }


}
