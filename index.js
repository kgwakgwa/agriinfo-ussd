const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", (req, res) => {
    let { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = "";

    // Split user input
    let textValue = text.split("*");

    if (text === "") {
        // Main Menu
        response = `CON Welcome to AgriInfo
1. Market Prices
2. Weather Updates
3. Farming Tips
4. Register as Farmer
0. Exit`;
    } else if (text === "1") {
        // Market Prices
        response = `CON Market Prices:
Maize: R350 / 50kg
Beans: R600 / 50kg
Goats: R1200 each

0. Back`;
    } else if (text === "2") {
        // Weather Updates
        response = `CON Weather Updates:
Today: Sunny, 30°C
Tomorrow: Light rain, 27°C

0. Back`;
    } else if (text === "3") {
        // Farming Tips
        response = `CON Choose Tips:
1. Crop Tips
2. Livestock Tips
3. Storage Tips
0. Back`;
    } else if (text === "3*1") {
        response = `CON Crop Tip:
Rotate crops yearly to keep soil healthy.

0. Back`;
    } else if (text === "3*2") {
        response = `CON Livestock Tip:
Provide clean water and vaccinate regularly.

0. Back`;
    } else if (text === "3*3") {
        response = `CON Storage Tip:
Keep harvest in dry, cool, ventilated stores.

0. Back`;
    } else if (text === "4") {
        response = `CON Enter your Name:`;
    } else if (textValue.length === 2 && textValue[0] === "4") {
        response = `CON Enter your Location:`;
    } else if (textValue.length === 3 && textValue[0] === "4") {
        response = `CON Enter your Crop/Livestock:`;
    } else if (textValue.length === 4 && textValue[0] === "4") {
        response = `END Thank you ${textValue[1]}! You are now registered.`;
    } else if (text.endsWith("*0")) {
        // Handle "Back" option
        response = `CON Welcome to AgriInfo
1. Market Prices
2. Weather Updates
3. Farming Tips
4. Register as Farmer
0. Exit`;
    } else if (text === "0") {
        // Exit
        response = "END Thank you for using AgriInfo!";
    } else {
        response = "END Invalid option. Please try again.";
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
