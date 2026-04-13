import db from "../config/db.js";

// ADD TASK
export const addTask = (req, res) => {
  const { event_id, task_name, deadline, status } = req.body;
  const user_id = req.userId;

  if (!event_id || !task_name || !deadline || !status) {
    return res.status(400).json({ error: "event_id, task_name, deadline, and status are required" });
  }

  const eventSql = "SELECT user_id FROM events WHERE id = ?";

  db.query(eventSql, [event_id], (err, eventResult) => {
    if (err) return res.status(500).json(err);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (eventResult[0].user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to add task for this event" });
    }

    const sql = `
      INSERT INTO tasks (event_id, task_name, deadline, status)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [event_id, task_name, deadline, status], (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Task added ✅" });
    });
  });
};

// GET TASKS
export const getTasks = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT tasks.*
    FROM tasks
    JOIN events ON tasks.event_id = events.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// UPDATE TASK
export const updateTask = (req, res) => {
  const { id } = req.params;
  const { task_name, deadline, status } = req.body;
  const user_id = req.userId;

  if (!task_name || !deadline || !status) {
    return res.status(400).json({ error: "task_name, deadline, and status are required" });
  }

  const sql = `
    UPDATE tasks
    JOIN events ON tasks.event_id = events.id
    SET tasks.task_name = ?, tasks.deadline = ?, tasks.status = ?
    WHERE tasks.id = ? AND events.user_id = ?
  `;

  db.query(sql, [task_name, deadline, status, id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found or not owned by user" });
    }

    res.json({ message: "Task updated ✅" });
  });
};

// DELETE TASK
export const deleteTask = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  const sql = `
    DELETE tasks
    FROM tasks
    JOIN events ON tasks.event_id = events.id
    WHERE tasks.id = ? AND events.user_id = ?
  `;

  db.query(sql, [id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found or not owned by user" });
    }

    res.json({ message: "Task deleted ✅" });
  });
};