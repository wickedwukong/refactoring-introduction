class PerformanceCalculator {
    constructor(aPerformance, play) {
        this.performance = aPerformance;
        this.play = play;
    }

    get volumeCredits() {
        let volumeCredits = 0;
        volumeCredits += Math.max(this.performance.audience - 30, 0);
        return volumeCredits;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${this.play.type}`);
    }
}

export function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enhancePerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enhancePerformance(aPerformance) {
        let result = Object.assign({}, aPerformance);
        const performanceCalculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        result.play = performanceCalculator.play;
        result.amount = performanceCalculator.amount;
        result.volumeCredits = performanceCalculator.volumeCredits;
        return result;
    }

    function totalAmount(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }

    function totalVolumeCredits(data) {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.volumeCredits;
        }
        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }
}
