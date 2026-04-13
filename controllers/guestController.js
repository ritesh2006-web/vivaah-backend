import db from "../config/db.js";

// ADD GUEST
export const addGuest = (req, res) => {
  const { event_id, name, rsvp_status, meal_pref } = req.body;
  const user_id = req.userId;

  if (!event_id || !name || !rsvp_status || !meal_pref) {
    return res.status(400).json({ error: "event_id, name, rsvp_status, and meal_pref are required" });
  }

  const eventSql = "SELECT user_id FROM events WHERE id = ?";

  db.query(eventSql, [event_id], (err, eventResult) => {
    if (err) return res.status(500).json(err);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (eventResult[0].user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to add guest for this event" });
    }

    const sql = `
      INSERT INTO guests (event_id, name, rsvp_status, meal_pref)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [event_id, name, rsvp_status, meal_pref], (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Guest added ✅" });
    });
  });
};

// GET GUESTS (USER-SPECIFIC)
export const getGuests = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT guests.*
    FROM guests
    JOIN events ON guests.event_id = events.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// UPDATE GUEST STATUS
export const updateGuestStatus = (req, res) => {
  const { id } = req.params;
  const { rsvp_status } = req.body;
  const user_id = req.userId;

  if (!rsvp_status) {
    return res.status(400).json({ error: "rsvp_status is required" });
  }

  const sql = `
    UPDATE guests
    JOIN events ON guests.event_id = events.id
    SET guests.rsvp_status = ?
    WHERE guests.id = ? AND events.user_id = ?
  `;

  db.query(sql, [rsvp_status, id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Guest not found or not owned by user" });
    }

    res.json({ message: "Guest RSVP status updated ✅" });
  });
};

// DELETE GUEST
export const deleteGuest = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  const sql = `
    DELETE guests
    FROM guests
    JOIN events ON guests.event_id = events.id
    WHERE guests.id = ? AND events.user_id = ?
  `;

  db.query(sql, [id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Guest not found or not owned by user" });
    }

    res.json({ message: "Guest deleted ✅" });
  });
};