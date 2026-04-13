import db from "../config/db.js";

export const getVenues = (req, res) => {
  const sql = "SELECT * FROM venues";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

export const addVenue = (req, res) => {
  const { name, location, capacity, price } = req.body;

  if (!name || !location || !capacity || !price) {
    return res.status(400).json({ error: "name, location, capacity, and price are required" });
  }

  const sql = "INSERT INTO venues (name, location, capacity, price) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, location, capacity, price], (err) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: "Venue added successfully" });
  });
};

export const bookVenue = (req, res) => {
  const { event_id, venue_id } = req.body;
  const user_id = req.userId;

  if (!event_id || !venue_id) {
    return res.status(400).json({ error: "event_id and venue_id are required" });
  }

  const eventSql = "SELECT user_id FROM events WHERE id = ?";
  db.query(eventSql, [event_id], (err, eventResult) => {
    if (err) return res.status(500).json(err);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (eventResult[0].user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to book venue for this event" });
    }

    const venueSql = "SELECT id FROM venues WHERE id = ?";
    db.query(venueSql, [venue_id], (err, venueResult) => {
      if (err) return res.status(500).json(err);
      if (venueResult.length === 0) {
        return res.status(404).json({ error: "Venue not found" });
      }

      const sql = "UPDATE events SET venue_id = ? WHERE id = ?";
      db.query(sql, [venue_id, event_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
          return res.status(500).json({ error: "Unable to book venue" });
        }
        res.json({ message: "Venue booked successfully ✅" });
      });
    });
  });
};

export const updateVenue = (req, res) => {
  const { id } = req.params;
  const { name, location, capacity, price } = req.body;

  if (!name || !location || !capacity || !price) {
    return res.status(400).json({ error: "name, location, capacity, and price are required" });
  }

  const sql = "UPDATE venues SET name = ?, location = ?, capacity = ?, price = ? WHERE id = ?";

  db.query(sql, [name, location, capacity, price, id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json({ message: "Venue updated successfully" });
  });
};

export const deleteVenue = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM venues WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.json({ message: "Venue deleted successfully" });
  });
};
