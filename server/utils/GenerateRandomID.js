const Counter = require("../models/CounterModel");

// generate MemberNumber

async function generateMemberNo(prefix = "ORGA") {
    const counter = await Counter.findOneAndUpdate(
        { name: "memberNumber" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}

// generate Lead Id

async function generateLeadId(prefix = "ORGA-LEAD") {
    const counter = await Counter.findOneAndUpdate(
        { name: "leadId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}

// staff id generate Random
async function generateStaffId(prefix = "ORGA-Staff") {
    const counter = await Counter.findOneAndUpdate(
        { name: "staffId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}
async function generateContractNo(prefix = "ORGA-Contract") {
    const counter = await Counter.findOneAndUpdate(
        { name: "contractNo" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );

    const formattedNumber = String(counter.value).padStart(3, "0");
    return `${prefix}-${new Date().getFullYear()}-${formattedNumber}`;
}

module.exports = { generateLeadId, generateMemberNo, generateStaffId, generateContractNo };