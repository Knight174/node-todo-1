const homedir = require('os').homedir(); // 获取home目录
const home = process.env.HOME || homedir; // 先从系统变量中获取
const path = require('path');
const dbPath = path.join(home, '.todo'); // 数据库路径（拼接而来的）
const fs = require('fs');

module.exports.add = (taskContent) => {
  // 1.读取文件
  fs.readFile(dbPath, {flag: 'a+'}, (err, data) => {
    if (err)  { 
      console.log(err); 
    } else {
      let list;
      try {
        // 此处的 data.toString() 应是一个JSON字符串，需要转换为真的数组！
        list = JSON.parse(data.toString());
      } catch (error) {
        // 如果报错，说明没有这样的数据，就创建一个新的数组！
        list = [];
      }
      // 2.添加一个任务
      const task = {
        title: taskContent,
        completed: false
      }
      list.push(task); // 将新建的任务推进 list 中
      // 3.将任务存储到文件
      const string = JSON.stringify(list); // 将 list 转换为 JSON 字符串
      // 将数据写入文件中
      fs.writeFile(dbPath, string, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      })
    }
  })
}