const express = require("express");
const app = express();
const port = 3001;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const users = range(1, 16).map((i) => ({
  id: i,
  name: `User ${i}`,
  todos: `/todos?user_id=${i}`,
}));

function generateUserTodos(userId) {
  return range(1, 10).map((i) => ({
    id: `todo-${userId}-${i}`,
    text: `Todo ${i} created by ${userId}`,
    isCompleted: Math.random() >= 0.5,
  }));
}

app.get("/users", (req, res) => {
  res.json({ users });
});

app.get("/todos", (req, res) => {
  const userId = req.query.user_id;
  const todos = generateUserTodos(userId);
  console.log(todos);
  res.json({ todos });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
