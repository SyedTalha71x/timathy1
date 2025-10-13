const Counter = require("../models/CounterModel");

async function generateMemberNo(prefix = "ORGA") {
    const counter = await Counter.findOneAndUpdate(
        { name: "memberNumber" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}

module.exports = generateMemberNo;
