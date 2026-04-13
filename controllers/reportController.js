import db from "../config/db.js";

export const getReport = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT
      events.title,
      events.budget,
      COALESCE(venues.price, 0) AS venue_price,
      (
        COALESCE((SELECT SUM(amount) FROM payments WHERE event_id = events.id), 0)
        + COALESCE((SELECT SUM(v.price)
            FROM bookings b
            JOIN vendors v ON b.vendor_id = v.id
            WHERE b.event_id = events.id), 0)
        + COALESCE(venues.price, 0)
      ) AS total_spent
    FROM events
    LEFT JOIN venues ON events.venue_id = venues.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};