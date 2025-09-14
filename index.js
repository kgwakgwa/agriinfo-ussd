const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/ussd", (req, res) => {
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
    response = `CON Choose product:
1. Maize
2. Sorghum
3. Goats
4. Cattle`;
  } else if (text === "1*1") {
    response = `END Maize Price Today:
Zeerust: R3,200/ton
Mahikeng: R3,150/ton
Updated: 14 Sept 2025`;
  } else if (text === "1*2") {
    response = `END Sorghum Price Today:
Zeerust: R2,800/ton
Mahikeng: R2,750/ton`;
  } else if (text === "2") {
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
app.listen(PORT, () => console.log(`USSD app running on port ${PORT}`));
