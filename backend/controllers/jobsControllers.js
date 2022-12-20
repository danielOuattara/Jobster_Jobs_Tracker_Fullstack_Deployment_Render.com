const Job = require("../models/JobModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { generateNotFoundError, generateBadRequestError } = require("../errors");
const mongoose = require("mongoose");
const moment = require("moment");

//-------------------------
const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  // default queryObejct
  const queryObject = {
    createdBy: req.user.userId,
  };

  // updated queryObject according to queries
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // sort jobs
  let sortItem = null;
  if (sort === "latest") {
    sortItem = "-createdAt";
  }
  if (sort === "oldest") {
    sortItem = "createdAt";
  }
  if (sort === "a-z") {
    sortItem = "position";
  }
  if (sort === "z-a") {
    sortItem = "-position";
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  const jobs = await Job.find(queryObject)
    .sort(sortItem)
    .limit(limit)
    .skip(skip);

  res.status(StatusCodes.OK).json({
    jobs,
    totalJobs,
    numOfPages,
  });
};

//-------------------------
const getJob = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.jobId,
    createdBy: req.user.userId,
  });
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).json({ job });
};

//-------------------------
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

//-------------------------
const updateJob = async (req, res) => {
  if (!req.body.company || !req.body.position) {
    return next(
      generateBadRequestError("Pease, provide Company and Position fields !"),
    );
  }
  const job = await Job.findOneAndUpdate(
    { _id: req.params.jobId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true },
  );
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).send({ job });
};

//-------------------------
const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.jobId,
    createdBy: req.user.userId,
  });
  if (!job) {
    return next(
      generateNotFoundError(
        `No job found with for ${req.user.name} with id ${req.params.jobId}`,
      ),
    );
  }
  res.status(StatusCodes.OK).json();
};

//------------------------
const showStats = async (req, res) => {
  //---
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  console.log("stats 1 = ", stats);

  stats = stats.reduce(function (accumulator, currentValue) {
    const { _id: title, count } = currentValue;
    accumulator[title] = count;
    return accumulator;
  }, (initialValue = {}));

  console.log("stats 2 = ", stats);

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  // ---
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    // { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  console.log("monthlyApplications = ", monthlyApplications);

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

//-------------------------
module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
};
