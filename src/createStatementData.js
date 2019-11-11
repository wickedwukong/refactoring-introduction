class PerformanceCalculator {
    constructor(aPerformance, play) {
        this.performance = aPerformance;
        this.play = play;
    }

    get amount() {
        let result = 0;
        switch (this.performance.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${this.performance.play.type}`);
        }
        return result;
    }

    get volumeCredits() {
        let volumeCredits = 0;
        volumeCredits += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.performance.play.type) volumeCredits += Math.floor(this.performance.audience / 5);
        return volumeCredits;
    }

}

class TragedyPerformanceCalculator extends PerformanceCalculator {
}

class ComedyPerformanceCalculator extends PerformanceCalculator {
}

function createPerformanceCalculator(result, play) {
    switch (play.type) {
        case "tragedy":
            return new TragedyPerformanceCalculator(result, play);
        case "comedy":
            return new ComedyPerformanceCalculator(result, play);
        default:
            throw new Error(`Unknown type: ${play.type}`);
    }
}

export function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;

    function enrichPerformance(aPerformance) {
        let result = Object.assign({}, aPerformance);
        const calculator = createPerformanceCalculator(result, playFor(result));
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0)
    }

    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
    }
}




