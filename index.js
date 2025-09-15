const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 🔑 Load service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // <-- put your downloaded Google service account file here
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

app.post("/ussd", async (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  text = text || "";

  let response = "";

  if (text === "") {
    response = `CON Welcome to AgriInfo 🌱
1. Market Prices
2. Weather Update
3. Farming Tips
4. Livestock Alerts`;
  } else if (text === "1") {
    // ✅ Fetch market products from Google Sheet
    try {
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: "YOUR_SHEET_ID_HERE", // e.g. 1mzP1qBAC29SlAYV7KZ2vUOJEk5GOu2VNuiVIfw2Avgg
        range: "Products!A2:B10", // A=product ID, B=product name
      });

      const rows = result.data.values;
      if (rows && rows.length > 0) {
        let menu = rows.map((row, i) => `${i + 1}. ${row[1]}`).join("\n");
        response = `CON Choose product:\n${menu}`;
      } else {
        response = "END No products found.";
      }
    } catch (err) {
      console.error("❌ Google Sheets Error:", err);
      response = "END Failed to fetch market prices.";
    }
  } else if (text.startsWith("1*")) {
    // ✅ Fetch specific product price from Google Sheet
    const choice = text.split("*")[1]; // e.g. "1" or "2"
    try {
      const result = await sheets.spreadsheets.values.get({
        spreadsheetId: "YOUR_SHEET_ID_HERE",
        range: "Products!A2:C10", // A=id, B=name, C=price
      });

      const rows = result.data.values;
      if (rows && rows[choice - 1]) {
        let [id, name, price] = rows[choice - 1];
        response = `END ${name} Price Today:\n${price}`;
      } else {
        response = "END Invalid choice.";
      }
    } catch (err) {
      console.error(err);
      response = "END Error reading sheet.";
    }
  } else if (text === "2") {
    // Example static weather
    response = `END Weather (Zeerust):
Rain chance: 70%
Rainfall: 12mm
Temp: 16-28°C
Updated: 14 Sept 2025`;
  } else if (text === "3") {
    response = `CON Choose:
1. Crop Tips
2. Livestock Tips`;
  } else if (text === "3*1") {
    response = `END Crop Tip:
Plant maize 2 weeks after first rains for best yield.`;
  } else if (text === "3*2") {
    response = `END Goat Tip:
Provide clean water daily. Deworm every 3 months.`;
  } else if (text === "4") {
    response = `END ALERT:
Goat pox reported near Ngaka Modiri Molema. Vaccinate before Oct.`;
  } else {
    response = `END Invalid choice.`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ USSD app running on port ${PORT}`));
