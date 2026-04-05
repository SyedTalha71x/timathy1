const { NotFoundError } = require('../../middleware/error/httpErrors');
const contractFormModel = require('../../models/contract/ContractFormModel');




const createContractForm = async (req, res, next) => {
    try {
        const studioId = req.user?.studio
        const { name, pages, folders, globalHeader, globalFooter } = req.body;

        const form = await contractFormModel.create({
            studioId: studioId,
            name,
            pages: pages || [{
                id: 1,
                title: "Contract Page",  // ← Add title field
                elements: []
            }],
            folders: folders || [],
            globalHeader: globalHeader || {
                enabled: false,
                content: '',
                fontSize: 12,
                alignment: 'center'
            },
            globalFooter: globalFooter || {
                enabled: false,
                content: '',
                fontSize: 12,
                alignment: 'center'
            },
            version: 1
        })

        return res.status(201).json({  // ← Use 201 for creation
            success: true,
            form: form
        })
    }
    catch (error) {
        next(error)
    }
}


const getContractForms = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const forms = await contractFormModel.find({ studioId: studioId })

        return res.status(200).json({
            success: true,
            forms: forms
        })
    }
    catch (error) {
        next(error)
    }
}


const updateContractForm = async (req, res, next) => {
    try {
        const studioId = req.user?.studio
        const { formId } = req.params
        const { name, pages, folders, globalHeader, globalFooter } = req.body;

        const updatedForm = await contractFormModel.findOneAndUpdate(
            { _id: formId, studioId: studioId },
            [
                {
                    $set: {
                        name: name || "$name",
                        pages: pages || "$pages",
                        folders: folders || "$folders",
                        globalHeader: globalHeader || "$globalHeader",
                        globalFooter: globalFooter || "$globalFooter",
                        version: { $add: ["$version", 1] }
                    }
                }
            ],
            { new: true }
        )

        if (!updatedForm) {
            throw new NotFoundError("Contract form not found")
        }

        return res.status(200).json({
            success: true,
            form: updatedForm
        })
    }
    catch (error) {
        next(error)
    }
}



const deleteContractForm = async (req, res, next) => {
    try {
        const { formId } = req.params;

        const studioId = req.user?.studio

        const form = await contractFormModel.findOne({ _id: formId, studioId: studioId })


        if (!form) throw new NotFoundError("Invalid Id")

        await contractFormModel.findByIdAndDelete(formId)

        return res.status(200).json({
            success: true,
            message: `${form.name} Deleted Successfully`
        })

    }
    catch (error) {
        next(error)
    }
}



module.exports = {
    getContractForms,
    createContractForm,
    updateContractForm,
    deleteContractForm
}