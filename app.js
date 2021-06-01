const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getAllTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        status='${status}'
    `;
  const todoList = await db.all(getAllTodoQuery);
  response.send(todoList);
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getAllTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        priority = '${priority}'
    `;
  const todoList = await db.all(getAllTodoQuery);
  response.send(todoList);
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getAllTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        priority='${priority}'AND status='${status}'
    `;
  const todoList = await db.all(getAllTodoQuery);
  response.send(todoList);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const getAllTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        todo LIKE '%${search_q}%'
    `;
  const todoList = await db.all(getAllTodoQuery);
  response.send(todoList);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT 
        *
    FROM
        todo
    WHERE
        id='${todoId}'
    `;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const addNewTodoQuery = `
    INSERT INTO
        todo(id,todo,priority,status)
    VALUES
        (${id},'${todo}','${priority}','${status}')
    `;
  await db.run(addNewTodoQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;
  const updateStatusQuery = `
    UPDATE
        todo
    SET
        status='${status}'
    WHERE
        id=${todoId}
    `;
  await db.run(updateStatusQuery);
  response.send("Status Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.body;
  const updatePriorityQuery = `
    UPDATE
        todo
    SET
        priority='${priority}'
    WHERE
        id=${todoId}
    `;
  await db.run(updatePriorityQuery);
  response.send("Priority Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;
  const updateTodoQuery = `
    UPDATE
        todo
    SET
        todo='${todo}'
    WHERE
        id=${todoId}
    `;
  await db.run(updateTodoQuery);
  response.send("Todo Updated");
});

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `
    DELETE FROM
        todo
    WHERE
        id=${todoId}
    `;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
