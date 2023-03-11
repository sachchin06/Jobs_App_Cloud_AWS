const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  req.user.email = "sachchin06@gmail.com";
  const jobs = await Job.find({ createdBy: req.user.email }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { email },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: email,
  });

  //2 options for error
  //1.casting error
  //2.cache error -  provide a wrong id

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.email;
  const job = await Job.create(req.body);

  //check errors

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { email },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (!company && !position) {
    throw new BadRequestError("Please provide company name and position");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: email },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { email },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: email });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send("Job deleted Successfully");
};

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
};
