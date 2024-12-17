import imaps from "imap-simple";
import dotenv from "dotenv";

dotenv.config();

export async function fetchEmails() {
  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
      authTimeout: 3000,
    },
  };

  try {
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    const fetchOptions = { bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);
    const emails = messages.map((message) => {
      const header = message.parts.find((part) => part.which === "HEADER.FIELDS (FROM TO SUBJECT DATE)").body;

      return {
        sender: header.from[0],
        subject: header.subject[0],
        timestamp: header.date[0],
      };
    });

    // Mark emails as seen
    const unseenUids = messages.map((message) => message.attributes.uid);
    if (unseenUids.length) {
      await connection.addFlags(unseenUids, "\\Seen");
    }

    connection.end();
    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw error;
  }
}
