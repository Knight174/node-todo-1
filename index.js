const db = require('./db');
const inquirer = require('inquirer');

// 1. 添加新任务
module.exports.add = async (taskContent) => {
  // 1.读取文件
  const list = await db.read();
  // 2.添加一个任务
  list.push({title: taskContent, completed: false});
  // 3.将任务写入文件
  await db.write(list);
}

// 2. 清空任务列表
module.exports.clear = async () => {
  await db.write([]);
}

// 3.2.2 添加新任务
function askForAddNewTask (list) {
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
    console.log('添加成功！');
  })
}

// 3.2.1.1 设置已完成状态
async function setCompletedState (list, index) {
  list[index].completed = true;
  await db.write(list);
  console.log('当前任务已完成！');
}
// 3.2.1.2 设置未完成状态
async function setIncompleteState (list, index) {
  list[index].completed = false;
  await db.write(list);
  console.log('当前任务待完成...');
}
// 3.2.1.3 修改标题
function updateTitle (list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新的标题',
    default: list[index].title // 原标题
  }).then(answer => {
    list[index].title = answer.title;
    db.write(list);
    console.log('标题更新成功！');
  });
}
// 3.2.1.4 移除任务
async function removeTask (list, index) {
  list.splice(index, 1);
  await db.write(list);
  console.log('删除成功！');
}

// 3.2.1 后续操作
function askForNextAction (list, index) {
  const actions = {
    setCompletedState,
    setIncompleteState,
    updateTitle,
    removeTask
  }
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择操作',
    choices: [
      {name: '退出', value: 'quit'},
      {name: '已完成', value: 'setCompletedState'},
      {name: '未完成', value: 'setIncompleteState'},
      {name: '改标题', value: 'updateTitle'},
      {name: '删除', value: 'removeTask'},
    ]
  }).then(answer => {
    const currentAction = actions[answer.action];
    currentAction && currentAction(list, index);
  })
}

// 3.2 打印之前的任务 + 后续操作
function displayTasks (list) {
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
      // 3.2.1 选中了一个任务，执行后续操作
      askForNextAction(list, index);
    } else if (index === -2) {
      // 3.2.2 添加新任务
      askForAddNewTask(list);
    }
  });
}

// 3. 展示所有事项
module.exports.showAll = async () => {
  // 3.1 读出之前的任务
  const list = await db.read();
  // 3.2 打印之前的任务
  displayTasks(list);
}