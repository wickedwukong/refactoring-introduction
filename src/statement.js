import {createStatementData} from "./createStatementData";

export {statement}

function renderPlainText(statementData) {
    let result = `Statement for ${statementData.customer}\n`;
    for (let perf of statementData.performances) {
        result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(statementData.totalAmount)}\n`;
    result += `You earned ${(statementData.totalVolumeCredits)} credits\n`;
    return result;

    function usd(value) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(value / 100);
    }
}


function statement(invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}
