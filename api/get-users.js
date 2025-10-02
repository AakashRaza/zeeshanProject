const fs = require("fs").promises;

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const { password } = req.query;

    if (password !== "development123") {
      return res.status(401).json({ message: "Unauthorized: Wrong password" });
    }

    try {
      let users = [];
      try {
        const data = await fs.readFile("users.json", "utf8");
        users = JSON.parse(data);
      } catch (err) {
        users = [];
      }
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
