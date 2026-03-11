const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Database connection failed:", err));

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number, min: 1 },
  gender: String,
  disease: { type: String, required: true },
  doctorAssigned: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  roomNumber: String,
  patientType: { type: String, enum: ["Inpatient", "Outpatient"] },
  status: { type: String, default: "Admitted" }
});

const Patient = mongoose.model("Patient", patientSchema);



app.post("/patients", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/patients", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/patients/search", async (req, res) => {
  try {
    const patients = await Patient.find({
      fullName: { $regex: req.query.name, $options: "i" }
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.delete("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});