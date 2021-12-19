const homedir = require('os').homedir();
const home = process.env.HOME || homedir;
const path = require('path');
const dbPath = path.join(home, '.todo');
const fs = require('fs');

const db = {
  // 1. 读取文件
  read (path = dbPath) {
    return new Promise ((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (err, data) => {
        if (err) return reject(err);

        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (error) {
          list = [];
        }
        resolve(list);
      })
    })
  },
  // 2. 写入文件
  write (list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list);
      fs.writeFile(path, string, (err) => {
        if (err) return reject(err);
        resolve();
      })
    })
  },
}

module.exports = db;