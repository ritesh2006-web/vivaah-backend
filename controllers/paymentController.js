import db from "../config/db.js";

// ADD PAYMENT
export const addPayment = (req, res) => {
  const { event_id, amount, status, payment_date } = req.body;
  const user_id = req.userId;

  if (!event_id || !amount || !status || !payment_date) {
    return res.status(400).json({ error: "event_id, amount, status, and payment_date are required" });
  }

  const eventSql = "SELECT user_id FROM events WHERE id = ?";

  db.query(eventSql, [event_id], (err, eventResult) => {
    if (err) return res.status(500).json(err);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (eventResult[0].user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to add payment for this event" });
    }

    const sql = `
      INSERT INTO payments (event_id, amount, status, payment_date)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [event_id, amount, status, payment_date], (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Payment added ✅" });
    });
  });
};

// GET PAYMENTS
export const getPayments = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT payments.*
    FROM payments
    JOIN events ON payments.event_id = events.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};