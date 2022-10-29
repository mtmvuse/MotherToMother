const express = require("express");
const dataRoute = express.Router(); // Creates a new router object

dataRoute.get("/", (req, res) => {
    res.send("Data Route!");
});