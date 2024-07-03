const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// GET all workouts
// #################################
const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({}).sort({ createAt: -1 }); // -1 = new on the top
  // if want to find some specific
  // const workouts = await Workout.find({ reps:20})

  res.status(200).json(workouts);
};

// GET a single workout
// #################################
const getWorkout = async (req, res) => {
  const { id } = req.params; // to get the id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    return res.status(404).json({ error: "Not Found" });
  }

  res.status(200).json(workout);
};

// CREATE new workout
// #################################
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body;


  // check error from user (blank fields)
  let emptyFields = []

  if(!title){
    emptyFields.push("title");
  }
  if(!load){
    emptyFields.push("load");
  }
  if(!reps){
    emptyFields.push("reps");
  }

  if(emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all the fields", emptyFields})
  }


  // add doc to database
  try {
    const workout = await Workout.create({
      title,
      load,
      reps,
    });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a workout
// #################################
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  const workout = await Workout.findOneAndDelete({ _id: id }); // _id is an id in mongoDB

  if (!workout) {
    return res.status(404).json({ error: "Not Found" });
  }

  res.status(200).json(workout);
};


// UPDATE a workout
// #################################
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid id" });
  }

  const workout = await Workout.findOneAndUpdate({ _id: id }, 
    { ...req.body }
    );

    if (!workout) {
        return res.status(404).json({ error: "Not Found" });
      }
    
      res.status(200).json(workout);
};


// export
module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout
};
