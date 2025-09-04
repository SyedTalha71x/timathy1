const EmailModel = require('../models/EmailModel');



const getEmail = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const email = await EmailModel.find({ to: userId }).populate('from', 'firstName lastName email img');
        res.status(200).json({
            success: true,
            email
        })
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    getEmail
}