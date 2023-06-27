"use strict";

require("./metrics")

const express = require('express');
const { metrics } = require('@opentelemetry/api');

const PORT = process.env.PORT || 3333
const app = express();

const meter = metrics.getMeter("test-metric")
const homePageCounter = meter.createCounter("home-page-clicks")
const userGreetCounter = meter.createCounter("greet-user-clicks")

app.get('/', (req, res) => {

  // Minimalistic example with no metadata
  // homePageCounter.add(1)

  // Example with metadata in the counter
  homePageCounter.add(1, {
    route: req.path,
    description: "Home page clicks",
    other: "whatever other attribute"
  })

  res.json({
    application: "opentelemetry-service-example",
    endpoints: [
      {
        url: "/",
        description: "This page"
      },
      {
        url: "/user/:name",
        description: "Greet user"
      }
    ]
  });
});

app.get('/user/:name', (req, res) => {
  userGreetCounter.add(1, {
    route: req.path,
    name: req.params.name,
    description: "Count how many times user is greeted"
  })


  res.json({
    message: `Hello, ${req.params.name}`
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
