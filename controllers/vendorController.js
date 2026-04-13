import db from "../config/db.js";

// ADD VENDOR
export const addVendor = (req, res) => {
  const { name, service_type, contact, price } = req.body;

  const sql = `
    INSERT INTO vendors (name, service_type, contact, price)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, service_type, contact, price], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Vendor added ✅" });
  });
};

// GET ALL VENDORS
export const getVendors = (req, res) => {
  const sql = "SELECT * FROM vendors";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// DELETE VENDOR
export const deleteVendor = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM vendors WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Vendor deleted ✅" });
  });
};