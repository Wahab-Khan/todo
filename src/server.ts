import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 8080;

// TODO(security): Never log full DATABASE_URL in production; it can contain passwords.
// For learning locally it's convenient, but on Render/production logs are persistent.
// console.log("DB URL:", process.env.DATABASE_URL);

app.listen(PORT, () => {
    // On Render the URL won't be localhost; this log is mainly to confirm the process started.
    console.log(`Server running (port ${PORT})`);
});