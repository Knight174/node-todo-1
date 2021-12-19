const db = require('./db');
const inquirer = require('inquirer');



// 添加新任务
module.exports.add = async (taskContent) => {
  // 1.读取文件
  const list = await db.read();
  // 2.添加一个任务
  list.push({title: taskContent, completed: false});
  // 3.将任务写入文件
  await db.write(list);
}

// 清空任务列表
module.exports.clear = async () => {
  await db.write([]);
}

// 展示所有事项
module.exports.showAll = async () => {
  // 1. 读出之前的任务
  const list = await db.read();
  // 2. 打印直接的任务
  // list.forEach((task, index) => {
  //   console.log(`${task.completed ? '[x]' : '[_]'} ${index + 1} -> ${task.title}`);
  // });

  inquirer
    .prompt({
        type: 'list',
        name: 'index',
        message: '你想要执行哪一项任务？',
        choices: [
          { name: '+ 添加任务', value: '-2'},
          { name: '- 退出', value: '-1'},
          ...list.map((task, index) => {
            return { name: `${task.completed ? '[x]' : '[_]'} ${index + 1} -> ${task.title}`, value: index }
          })
        ],
      })
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        // 选中了一个任务
        inquirer.prompt({
          type: 'list',
          name: 'action',
          message: '请选择操作',
          choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'completed'},
            {name: '未完成', value: 'incomplete'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除', value: 'remove'},
          ]
        }).then(answer => {
          console.log(answer.action);
          switch (answer.action) {
            case 'completed':
              list[index].completed = true;
              db.write(list)
              break;
            case 'incomplete':
              list[index].completed = false;
              db.write(list)
              break;
            case 'updateTitle':
              inquirer.prompt({
                type: 'input',
                name: 'title',
                message: '请输入新的标题',
                default: list[index].title // 原标题
              }).then(answer => {
                list[index].title = answer.title;
                db.write(list);
              });
              break;
            case 'remove':
              list.splice(index, 1);
              db.write(list);
              break;
          }
        })
      } else if (index === -2) {
        // 添加任务
        inquirer.prompt({
          type: 'input',
          name: 'title',
          message: '请添加新任务标题',
        }).then(answer => {
          list.push({
            title: answer.title,
            completed: false
          })
          db.write(list);
        })
      }
    });
}