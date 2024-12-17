import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import { fetchEmails } from "./emailService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function saveEmailsToDatabase(emails) {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO email_data (sender, subject, timestamp) VALUES (?, ?, ?)`;

    emails.forEach((email) => {
      db.run(query, [email.sender, email.subject, email.timestamp], (err) => {
        if (err) {
          console.error("Error saving email:", err.message);
          reject(err);
        }
      });
    });

    resolve();
  });
}

app.get("/fetch-emails", async (req, res) => {
  try {
    const emails = await fetchEmails();
    if (!emails.length) return res.json({ message: "No new emails found." });

    await saveEmailsToDatabase(emails);
    res.json({ message: "Emails fetched and stored successfully.", emails });
  } catch (error) {
    console.error("Error in /fetch-emails:", error.message);
    res.status(500).json({ error: "Failed to fetch and save emails." });
  }
});

app.get("/emails", (req, res) => {
  const query = `SELECT * FROM email_data`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving data:", err.message);
      return res.status(500).json({ error: "Failed to fetch email data." });
    }
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
