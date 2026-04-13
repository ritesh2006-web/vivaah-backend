import db from "../config/db.js";

// CREATE EVENT
export const createEvent = (req, res) => {
  const { title, date, budget } = req.body;
  const user_id = req.userId; // from token

  if (!title || !date || !budget) {
    return res.status(400).json({ error: "Title, date, and budget are required" });
  }

  const sql = `
    INSERT INTO events (user_id, title, date, budget)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, title, date, budget], (err) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({ message: "Event created successfully ✅" });
  });
};

// GET ALL EVENTS (ONLY USER'S EVENTS)
export const getUserEvents = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT 
      events.*, 
      venues.name AS venue_name,
      venues.location AS venue_location,
      venues.price AS venue_price,
      venues.capacity AS venue_capacity
    FROM events
    LEFT JOIN venues 
      ON events.venue_id = venues.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// DELETE EVENT
export const deleteEvent = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  const sql = "DELETE FROM events WHERE id = ? AND user_id = ?";

  db.query(sql, [id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found or not owned by user" });
    }

    res.json({ message: "Event deleted ✅" });
  });
};

// UPDATE EVENT
export const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, date, budget } = req.body;
  const user_id = req.userId;

  if (!title || !date || !budget) {
    return res.status(400).json({ error: "Title, date, and budget are required" });
  }

  const sql = `
    UPDATE events
    SET title = ?, date = ?, budget = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [title, date, budget, id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found or not owned by user" });
    }

    res.json({ message: "Event updated ✅" });
  });
};