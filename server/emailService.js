import Imap from "imap";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";
import db from "./db.js"; 
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'email-processing.log' }),
  ],
});

const MAX_RETRIES = 5;  
const INITIAL_BACKOFF = 1000; 
const MAX_BACKOFF = 30000;  
let retries = 0;

async function fetchEmails() {
  return new Promise((resolve, reject) => {
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
        authTimeout: 10000,
      },
    };

    const imap = new Imap(config.imap);
    const emails = []; 

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        imap.search(["UNSEEN"], (err, results) => {
          if (err) {
            reject(err);
            return;
          }

          if (!results || results.length === 0) {
            logger.info("No unseen emails found.");
            imap.end();
            resolve(emails); 
            return;
          }

          const f = imap.fetch(results, { bodies: "" });

          f.on("message", (msg, seqno) => {
            logger.info(`Processing email #${seqno}`);
            let emailData = {};

            msg.on("body", (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  logger.error(`Error parsing email #${seqno}: ${err.message}`);
                  return;
                }

                emailData = {
                  sender: parsed.from?.text || "",
                  subject: parsed.subject || "",
                  timestamp: parsed.date || new Date().toISOString(),
                  body: parsed.html || parsed.text || "",
                };

                db.run(
                  `
                  INSERT INTO email_data (sender, subject, timestamp, body)
                  VALUES (?, ?, ?, ?)
                `,
                  [emailData.sender, emailData.subject, emailData.timestamp, emailData.body],
                  (err) => {
                    if (err) {
                      logger.error(`Error inserting email #${seqno} into database: ${err.message}`);
                    } else {
                      const logTimestamp = new Date().toISOString();
                      logger.info(`[${logTimestamp}] Successfully processed email from ${emailData.sender} - ${emailData.subject}`);
                    }
                  }
                );

                emails.push(emailData);
              });
            });

            msg.once("attributes", (attrs) => {
              const { uid } = attrs;

              imap.addFlags(uid, ["\\Seen"], (err) => {
                if (err) {
                  logger.error(`Error marking email #${seqno} as read: ${err.message}`);
                } else {
                  logger.info(`Email #${seqno} marked as read.`);
                }
              });
            });
          });

          f.once("error", (err) => {
            reject(err);
          });

          f.once("end", () => {
            logger.info("Finished fetching all unseen emails.");
            imap.end();
          });
        });
      });
    });

    imap.once("error", (err) => {
      logger.error(`IMAP error: ${err.message}`);
      if (retries < MAX_RETRIES) {
        retries++;
        const backoffDelay = Math.min(INITIAL_BACKOFF * Math.pow(2, retries - 1), MAX_BACKOFF);
        logger.info(`Retrying connection... Attempt ${retries} of ${MAX_RETRIES}. Next retry in ${backoffDelay / 1000} seconds.`);
        
        setTimeout(() => {
          imap.connect(); 
        }, backoffDelay);
      } else {
        reject(`Failed to connect after ${MAX_RETRIES} attempts`);
      }
    });

    imap.once("end", () => {
      logger.info("IMAP connection ended.");
      resolve(emails); 
    });

    imap.connect();
  });
}

export { fetchEmails };
