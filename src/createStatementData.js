class PerformanceCalculator {
    constructor(aPerformance) {
        this.performance = aPerformance;
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
        return volumeCredits
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
        const calculator = new PerformanceCalculator(aPerformance);
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
