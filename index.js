const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: "Hello from CI/CD demo app" });
});

module.exports = app;

