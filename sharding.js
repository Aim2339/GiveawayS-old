const { ShardingManager } = require("discord.js");
const moment = require("moment-timezone");
const chalk = require("chalk");
const manager = new ShardingManager("./index.js", { token: process.env.TOKEN });

// Trying to spawn the required shards.
manager
  .spawn()
  .catch((error) => console.error(`[ERROR/SHARD] Shard failed to spawn.`));

manager.on("shardCreate", (shard) => {
  // Listeing for the ready event on shard.
  shard.on("ready", () => {
    console.log(
      chalk.red(
        `[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway!`
      )
    );
    // Sending the data to the shard.
    shard.send({ type: "shardId", data: { shardId: shard.id } });
  });
});

console.log(
  chalk.green(
    `-- ${moment().tz("Asia/Kolkata").format("MMMM Do")}, ${moment()
      .tz("Asia/Kolkata")
      .format("hh:mm a")} IST --`
  )
);
