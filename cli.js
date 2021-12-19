#!/usr/bin/env node
const { program } = require('commander');
const api = require('./index');
const pkg = require('./package.json');

// 选项
program
  .option('-v --version', 'show the current version')
  .version(pkg.version)
// 命令
// 命令1：添加新任务
program
  .command('add') // 在终端中输入：node index add task1 task2 task3
  .argument('<tasks...>', 'taskNameList') // 多参数处理
  .description('The cmd is used to add a task or more tasks.') // 命令描述
  .action((tasks) => { 
    const words = tasks.join(' ');
    api.add(words)
      .then(() => {
        console.log('添加成功！');
      })
      .catch(err => {
        console.log('添加失败！错误原因：' + err);
      });
  })
// 命令2：清空任务列表
program
  .command('clear')
  .description('The cmd is used to clear all tasks.')
  .action(() => { 
    api.clear()
      .then(() => {
        console.log('清除成功！');
      })
      .catch(err => {
        console.log('清除失败！错误原因：' + err);
      });
  })

// 用户直接调用 node cli.js
if (process.argv.length === 2) {
  void api.showAll();
} else {
  program.parse(process.argv);
}
