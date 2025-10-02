const fs = require("fs").promises;

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email } = req.body;

    if (!name || !email || typeof name !== "string" || typeof email !== "string") {
      return res.status(400).json({ message: "Invalid name or email" });
    }

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    if (!sanitizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      let users = [];
      try {
        const data = await fs.readFile("users.json", "utf8");
        users = JSON.parse(data);
      } catch (err) {
        users = [];
      }

      users.push({ name: sanitizedName, email: sanitizedEmail });
      await fs.writeFile("users.json", JSON.stringify(users, null, 2));
      return res.status(200).json({ message: "User added successfully!" });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};