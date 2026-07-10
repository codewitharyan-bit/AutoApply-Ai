require("dotenv").config();

const { runJobImport } = require("../services/jobImport.service");

(async () => {
  try {
    const clerkId = process.argv[2] || process.env.CLERK_ID;

    if (!clerkId) {
      throw new Error("Missing clerkId. Pass it as: node src/workers/jobImport.worker.js <clerkId> or set CLERK_ID in environment.");
    }

    await runJobImport(clerkId);

  } catch (err) {

    console.error(err);

  }
})();