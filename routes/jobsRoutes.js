const express = require("express");
const router = express.Router();
const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
} = require("../controllers/jobsControllers");
const checkTestUser = require("./../middleware/checkTestUser");
//--------------------------------------------------

router.route("/").post(checkTestUser, createJob).get(getAllJobs);
router.get("/stats", showStats);
router
  .route("/:id")
  .get(getJob)
  .delete(checkTestUser, deleteJob)
  .patch(checkTestUser, updateJob);

module.exports = router;
