const fs = require("fs");
const util = require("util");
const path = require("path");
const yargs = require("yargs");
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

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

const sortDir2 = path.join(__dirname, argv.entry);
const mainDir = path.join(__dirname, argv.output);

access(mainDir)
  .then(() => {
    console.log(
      mainDir + "- такая директория уже создана. Выберете другое имя."
    );
  })
  .catch(err => {
    mkdir(mainDir)
      .then(() => {
        console.log("Create dir: " + mainDir);
        readDir(sortDir2);
      })
      .catch(err => {
        console.log("fgf" + err);
        process.exit(0);
      });
  });

function copyFileFunc(elementPathName, sortDir, element) {
  access(elementPathName)
    .then(() => {
      console.log("Такая директория уже создана - " + elementPathName);
      // если создана, то просто копируем в нее файл
      copyFile(path.join(sortDir, element), path.join(elementPathName, element))
        .then(() => {
          console.log(
            "File: " + element + " copied to " + element[0].toUpperCase()
          );
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      console.log("Такой директории еще нет - " + elementPathName);
      // иначе создаем директорию, а затем копируем в нее файл
      mkdir(elementPathName)
        .then(() => {
          console.log("Create dir: " + elementPathName);
          // если создана, то просто копируем в нее файл
          fs.copyFile(
            path.join(sortDir, element),
            path.join(elementPathName, element),
            err => {
              if (err) throw err;
              console.log(
                "File: " + element + " copied to " + element[0].toUpperCase()
              );
            }
          );
        })
        .catch(err => {
          console.log("Ошибка создания директории " + err);
          copyFile(elementPathName, sortDir, element);
        });
    });
}

function readDir(sortDir) {
  // пробегаем по содержимому директории
  readdir(sortDir)
    .then(files => {
      files.forEach(element => {
        // получаем инфо по каждому element
        stat(path.join(sortDir, element))
          .then(stats => {
            console.log("Элемент - " + element);
            if (stats.isFile()) {
              console.log('"Это файл" - ' + element);
              console.log("****************************");
              // путь к директории для файла
              let elementPathName = path.join(
                mainDir,
                element[0].toUpperCase()
              );
              // копируем файл
              copyFile(elementPathName, sortDir, element);
            }
            if (stats.isDirectory()) {
              console.log('"Это директория" - ' + element);
              console.log("****************************");
              // углубляемся
              readDir(path.join(sortDir, element));
            }
          })
          .catch(err => {
            console.log(err);
            return; // exit here since stats will be undefined
          });
      });
    })
    .catch(err => "Fail to read catalog");
}
