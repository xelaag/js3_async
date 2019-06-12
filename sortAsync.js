const fs = require("fs");
const util = require("util");
const path = require("path");
const yargs = require("yargs");

const argv = yargs
  .usage("Usage: $0 [options]")
  .help("help")
  .alias("help", "h")
  .version("0.0.1")
  .alias("version", "v")
  .example("$0 --entry ./filesDir -D", "--> Sorting of files in folders")
  .option("entry", {
    alias: "e",
    describe: "The path of the source directory",
    demandOption: true
  })
  .option("output", {
    alias: "o",
    describe: "The path of the output directory",
    default: "/output"
  })
  .epilog("Second homework on the node.js course").argv;
console.log(argv);
