const Counter = require("../models/CounterModel");

async function generateLeadId(prefix = "ORGA-LEAD") {
    const counter = await Counter.findOneAndUpdate(
        { name: "leadId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}

module.exports = generateLeadId;
