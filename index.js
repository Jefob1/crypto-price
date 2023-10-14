const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const Airtable = require("airtable");

const app = express();
const port = 3001;

app.use(bodyParser.json());

const COINSTATS_API_URL = "https://api.coinstats.app/public/v1/coins";

const base = new Airtable({
  apiKey:
    "pat6Kyz5adkq28PFZ.9362de1ecd7b06c7b82bab90d6db803478850fd20c7cd59653fd441a74b728c0",
}).base("appHGoZ55MSJXyc8j");

async function updateAirtable() {
  try {
    console.log("Connecting to Airtable...");
    const response = await axios.get(COINSTATS_API_URL, {
      params: {
        skip: 0,
        limit: 10,
      },
    });

    const bitcoinPrice = response.data.coins[0]?.price;
    const ethereumPrice = response.data.coins[1]?.price;
    const usdtPrice = response.data.coins[2]?.price;
    const bscPrice = response.data.coins[3]?.price;
    const ripplePrice = response.data.coins[5]?.price;
    const solPrice = response.data.coins[9]?.price;

    base("Crypto Price").update(
      [
        {
          fields: {
            id: "rec3A2Wa3oi1jn2sq",
            Name: "Bitcoin",
            Symbol: "BTC",
            Price: bitcoinPrice,
          },
        },
        {
          fields: {
            id: "reccndk9qnuTfdqVZ",
            Name: "Ethereum",
            Symbol: "ETH",
            Price: ethereumPrice,
          },
        },
        {
          fields: {
            id: "recADveP2WyJn5Ni9",
            Name: "Solana",
            Symbol: "SOL",
            Price: solPrice,
          },
        },
        {
          fields: {
            id: "recZCtgAKFT1VFZCP",
            Name: "Ripple",
            Symbol: "XRP",
            Price: ripplePrice,
          },
        },
        {
          fields: {
            id: "recCkdrjZlzGoZ6Di",
            Name: "Tether USD",
            Symbol: "USDT",
            Price: usdtPrice,
          },
        },
        {
          fields: {
            id: "rec2BISt72sLII5mZ",
            Name: "Binance Smart Chain",
            Symbol: "BSC",
            Price: bscPrice,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({success: false, message: "Failed to update Airtable"});
          return;
        }

        records.forEach(function (record) {
          console.log(record.get("Symbol"));
        });

        res
          .status(200)
          .json({success: true, message: "Airtable updated successfully"});
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    res.status(500).json({success: false, message: "Internal Server Error"});
  }
}

setInterval(() => {
  updateAirtable;
}, 300000);

app.listen(port, () => {
  console.log(`Webhook service listening at http://localhost:${port}`);
});
