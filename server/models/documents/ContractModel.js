const mongoose = require('mongoose');


const contractSchema = new mongoose.Schema({
    
})



const ContractModel = mongoose.model('Contract', contractSchema);
module.exports = ContractModel;