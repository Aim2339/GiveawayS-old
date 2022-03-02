const express = require("express");
const chalk = require("chalk");
const server = express();

server.all("/", (req, res) => {
  res.send("Bot is running!");
});

function keepAlive() {
  server.listen(3000, () => {
    console.log(chalk.white("Server is ready!"));
  });
}

module.exports = keepAlive;
