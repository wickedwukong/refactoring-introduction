class PerformanceCalculator {
    constructor(aPerformance, play) {
        this.performance = aPerformance;
        this.play = play;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumeCredits() {
        let volumeCredits = 0;
        volumeCredits += Math.max(this.performance.audience - 30, 0);

        if ("comedy" === this.play.type) volumeCredits += Math.floor(this.performance.audience / 5);
        return volumeCredits
    }


}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy":
            return new TragedyPerformanceCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyPerformanceCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
    }
}

class TragedyPerformanceCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyPerformanceCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }
}

export function createStatementData(invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        let performance = Object.assign({}, aPerformance);
        const calculator = createPerformanceCalculator(aPerformance, playFor(performance));
        performance.play = playFor(performance);
        performance.amount = calculator.amount;
        performance.volumeCredits = calculator.volumeCredits;

        return performance;
    }

    function totalVolumeCredits(data) {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
    }

    function totalAmount(data) {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }
}
