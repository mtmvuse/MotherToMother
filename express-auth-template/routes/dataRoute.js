const express = require("express");
const dataRoute = express.Router(); // Creates a new router object

dataRoute.get("/", (req, res) => {
    res.send(" \"93% of people don't check facts they read on the internet\" - Abraham Lincoln");
});

module.exports = dataRoute;