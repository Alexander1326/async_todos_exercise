const fetch = require("node-fetch");

async function getTasksInChunks(effects) {

  let users = await effects.fetchUsers();

  const allTodos = [];

  for (let i = 0; i < users.users.length; i += 5) {

    let chunk = users.users.slice(i, i + 5);
    let result = [];

    for (let j = 0; j < chunk.length; j++) {
      let response = effects.fetchUsersTodos(chunk[j].id);
      result.push(response);
    }

    let responses = await Promise.all(result);

    for (let k = 0; k < responses.length; k++) {
      allTodos.push(...responses[k].todos);
    }
    await effects.delay(1000);
  }

  let finalResult = [];

  for (let i = 0; i < users.users.length; i++) {
    let count = 0;
    let id = users.users[i].id;
    for (let j = 0; j < allTodos.length; j++) {
      let todoUserId = allTodos[j].id.split("-");
      if (todoUserId[1] === String(id) && allTodos[j].isCompleted) {
        count++;
      }
    }
    finalResult.push({
      id: users.users[i].id,
      name: `User ${users.users[i].id}`,
      numTodosCompleted: count,
    })
  }

  return finalResult;
}

async function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time)
  })
}

async function fetchUsers() {
  let users = await fetch("http://localhost:3001/users")
  const data = await users.json();
  return data;
}

async function fetchUsersTodos(userId) {
  let response = await fetch(`http://localhost:3001/todos?user_id=${userId}`)
  return response.json();
}

const effects = {
  fetchUsers: fetchUsers,
  fetchUsersTodos: fetchUsersTodos,
  delay: delay,
}

getTasksInChunks(effects).then((result) => {
  console.log(result);
})

