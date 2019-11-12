export {statement}

function renderPlainText(statementData, plays) {
    let result = `Statement for ${statementData.customer}\n`;
    for (let perf of statementData.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${(totalVolumeCredits())} credits\n`;
    return result;

    function totalAmount() {
        let totalAmount = 0;
        for (let perf of statementData.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }

    function usd(value) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(value / 100);
    }

    function volumeCreditsFor(aPerformance) {
        let volumeCredits = 0;
        volumeCredits += Math.max(aPerformance.audience - 30, 0);

        if ("comedy" === aPerformance.play.type) volumeCredits += Math.floor(aPerformance.audience / 5);
        return volumeCredits
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of statementData.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }
}


function statement(invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        let performance = Object.assign({}, aPerformance);
        performance.play = playFor(performance);
        performance.amount = amountFor(performance);

        return performance;
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


    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

}
