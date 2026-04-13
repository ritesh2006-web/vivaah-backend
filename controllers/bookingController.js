import db from "../config/db.js";

// BOOK VENDOR FOR EVENT
export const createBooking = (req, res) => {
  const { event_id, vendor_id, booking_date } = req.body;
  const user_id = req.userId;

  if (!event_id || !vendor_id || !booking_date) {
    return res.status(400).json({ error: "event_id, vendor_id, and booking_date are required" });
  }

  const eventSql = "SELECT user_id FROM events WHERE id = ?";

  db.query(eventSql, [event_id], (err, eventResult) => {
    if (err) return res.status(500).json(err);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (eventResult[0].user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to book vendor for this event" });
    }

    const sql = `
      INSERT INTO bookings (event_id, vendor_id, booking_date)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [event_id, vendor_id, booking_date], (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Vendor booked for event ✅" });
    });
  });
};

// GET BOOKINGS WITH JOIN 🔥
export const getBookings = (req, res) => {
  const user_id = req.userId;

  const sql = `
    SELECT 
      bookings.id,
      events.title AS event_name,
      vendors.name AS vendor_name,
      vendors.service_type,
      bookings.booking_date
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    JOIN vendors ON bookings.vendor_id = vendors.id
    WHERE events.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// CANCEL VENDOR BOOKING
export const cancelBooking = (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;

  const sql = `
    DELETE bookings
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    WHERE bookings.id = ?
      AND events.user_id = ?
  `;

  db.query(sql, [id, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found or not owned by user" });
    }

    res.json({ message: "Vendor booking canceled ✅" });
  });
};