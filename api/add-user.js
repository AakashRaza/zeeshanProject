const fs = require("fs").promises;

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      job,
      age,
      passportPic,
      idFront,
      idBack,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (typeof email !== "string" || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const sanitizedName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone.trim();
    const sanitizedJob = job ? job.trim() : "";
    const sanitizedAge = age ? age.trim() : "";

    try {
      let users = [];
      try {
        const data = await fs.readFile("users.json", "utf8");
        users = JSON.parse(data);
      } catch {
        users = [];
      }

      // Create new user object
      const newUser = {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        password, // In production: hash this before saving!
        job: sanitizedJob,
        age: sanitizedAge,
        passportPic,
        idFront,
        idBack,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Save updated users list
      await fs.writeFile("users.json", JSON.stringify(users, null, 2));

      return res.status(200).json({ message: "User added successfully!" });
    } catch (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} not allowed` });
  }
};
