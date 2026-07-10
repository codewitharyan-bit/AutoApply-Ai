const asyncHandler = require('../middleware/asyncHandler');
const {
    saveApplication,
    getApplicationsByClerkId,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication: deleteApplicationService,
} = require("../services/application.service");

const createApplication = asyncHandler(async (req, res) => {
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
});

const getApplications = asyncHandler(async (req, res) => {
    const applications = await getApplicationsByClerkId(req.clerkId);

    res.json({
        success: true,
        data: applications,
    });
});

const getApplication = asyncHandler(async (req, res) => {
    const application = await getApplicationById(
        req.clerkId,
        req.params.id
    );

    res.json({
        success: true,
        data: application,
    });
});

const updateApplication = asyncHandler(async (req, res) => {
    const application = await updateApplicationStatus(
        req.clerkId,
        req.params.id,
        req.body.status
    );

    res.json({
        success: true,
        data: application,
    });
});

const deleteApplication = asyncHandler(async (req, res) => {
    await deleteApplicationService(req.clerkId, req.params.id);

    res.json({
        success: true,
        message: "Application deleted successfully.",
    });
});

module.exports = {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
};