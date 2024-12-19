# Email List App

![Email List App](https://github.com/user-attachments/assets/13f93e87-82af-4236-959f-06dec79c61c9)

## Overview

The **Email List App** is a tool designed to connect to an email server using IMAP, retrieve unread emails, and display key information such as the sender, subject, and timestamp. The app stores the email data in a local SQLite database and provides error handling and logging functionality for reliability and transparency.

---

## Features

- **Connect to IMAP Servers**: Retrieve unread emails seamlessly from your email account.
- **Email Parsing**: Extract sender information, email subject, and timestamp.
- **Local Storage**: Save email data in a SQLite database for easy access.
- **Error Handling**: Gracefully handle connection errors, authentication failures, and email parsing issues.
- **Logging**: Detailed logs for monitoring and debugging.
- **User-friendly Interface**: Intuitive and clean interface for viewing and managing emails.

---

## Screenshots

### Email List View:
![Email List View](https://github.com/user-attachments/assets/5bff6c72-8c6a-4266-a721-1b39235fd136)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or higher recommended)
- [SQLite](https://sqlite.org) installed locally

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/TaichKarna/email-list-app.git
   cd email-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```env
   # Email Configuration
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-email-password"
   EMAIL_HOST="imap.gmail.com"
   EMAIL_PORT=993
   ```

4. Run the application:
   ```bash
   npm start
   ```

---

## Usage

1. Start the application.
2. The app will connect to the configured IMAP server and retrieve unread emails.
3. View the list of unread emails in the app interface.
4. Use the logs to monitor app behavior or troubleshoot issues.

---

## Database Structure

The app uses a SQLite database to store email data. The schema includes the following:

| Field         | Type    | Description                 |
|---------------|---------|-----------------------------|
| `id`          | INTEGER | Unique ID for each email    |
| `sender`      | TEXT    | Email address of the sender |
| `subject`     | TEXT    | Subject of the email        |
| `timestamp`   | TEXT    | Date and time received      |
| `body`        | TEXT    | Content of the email        |

---

## Logging

The app logs:
- IMAP connection events
- Successful email retrievals
- Errors during connection or parsing

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- [IMAP](https://tools.ietf.org/html/rfc3501) protocol documentation for email handling
- [SQLite](https://sqlite.org) for lightweight local database management
- Inspiration from various email parsing tools and projects.

