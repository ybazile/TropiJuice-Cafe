const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- SQL Injection Vulnerable Login ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Fake vulnerable SQL check
  if (username.includes("'") || password.includes("'")) {
    return res.redirect("/admin.html");
  }

  return res.send("Invalid login. Try SQL injection.");
});

// --- Command Injection Vulnerable Admin Page ---
app.post("/run", (req, res) => {
  const { cmd } = req.body;

  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.send("Error: " + err.message);

    // Write stolen credentials to public file
    fs.writeFileSync("./public/credentials.json", stdout);

    res.send(`
      <h2>Command Output</h2>
      <pre>${stdout}</pre>
      <p>Credentials saved to /credentials.json</p>
    `);
  });
});

// --- Start Server ---
app.listen(3000, () => {
  console.log("TropiJuice Café running on port 3000");
});
