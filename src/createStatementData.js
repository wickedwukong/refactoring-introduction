export function createStatementData(invoice, plays) {
    const statementDate = {};
    statementDate.customer = invoice.customer;
    statementDate.performances = invoice.performances.map(enhancePerformance);
    statementDate.totalAmount = totalAmount(statementDate);
    statementDate.totalVolumeCredits = totalVolumeCredits(statementDate);

    return statementDate;

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

    function totalVolumeCredits(data) {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
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
