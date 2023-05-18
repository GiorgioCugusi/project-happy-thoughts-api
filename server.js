import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 140
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});


const Thought = mongoose.model("Thought", thoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
const listEndpoints = require('express-list-endpoints')

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});



app.post("/fruit_or_vegetable", async (req, res) => {
  const {kind, name, description} = req.body;
  try{
    const foodItem = await new FruitOrVegetable({kind, name, description}).save();
    res.status(201).json({
      success: true,
      response: foodItem
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e
    });
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

