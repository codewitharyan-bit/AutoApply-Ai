const {
    saveApplication,
    getApplicationsByClerkId,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication: deleteApplicationService,
} = require("../services/application.service");

const createApplication = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required.",
            });
        }

        const application = await saveApplication(
            req.clerkId,
            jobId
        );

        return res.status(201).json({
            success: true,
            data: application,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getApplications = async (req, res) => {
    try {
        const applications = await getApplicationsByClerkId(req.clerkId);

        res.json({
            success: true,
            data: applications,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


const getApplication = async (req, res) => {
    try {
        const application = await getApplicationById(
            req.clerkId,
            req.params.id
        );

        res.json({
            success: true,
            data: application,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateApplication = async (req, res) => {
    try {
        const application = await updateApplicationStatus(
            req.clerkId,
            req.params.id,
            req.body.status
        );

        res.json({
            success: true,
            data: application,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteApplication = async (req, res) => {
    try {
        await deleteApplicationService(req.clerkId, req.params.id);

        res.json({
            success: true,
            message: "Application deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
};