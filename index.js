const prompt = require("prompt-sync")({ sigint: true });
const axios = require("axios");

("use strict");

const token = prompt("Please enter Twitch Auth Token: ");
console.log(`Hey there ${token}`);

const channelID = "95416766";
const clientID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
const TWITCH_URL = "https://gql.twitch.tv/gql";
const TWENTY_POO = "https://cpt-api.twentypoo.com/numberGuesses/";
const COOKIE = "SID=s%3A3f7SFgyJIaIDxjwylIRUWhm707B-9G_q.1IwYpCgT%2FBnD2cKwKa6l3H2qb2axPvp4eY4Jr9KWsNw";

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function isNumberValid(number) {
  return getData(`${TWENTY_POO}${number}`, { cookie: COOKIE }).then((data) => {
    return data.length;
  });
}

async function getChannelRewardData() {
  const payload = [
    {
      operationName: "ChannelPointsContext",
      variables: {
        channelLogin: "frostprime_",
        includeGoalTypes: ["CREATOR"],
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "1530a003a7d374b0380b79db0be0534f30ff46e61cffa2bc0e2468a909fbc024",
        },
      },
    },
  ];

  const data = await postData(TWITCH_URL, payload, token, { "Client-Id": clientID });

  const customReward = data[0]["data"]["community"]["channel"]["communityPointsSettings"]["customRewards"];

  const { id, isEnabled, isInStock, isPaused, prompt, title, cost } = customReward[0];

  return { id, isEnabled, isInStock, isPaused, prompt, title, cost };
}
async function generateNumber() {
  while (true) {
    const number = Math.floor(Math.random() * (999999 - 1)) + 1;
    try {
      const isValid = await isNumberValid(number);
      if (isValid) {
        return number;
      }
    } catch (e) {
      console.log("Error calling the API");
      await timer(3000);
    }
  }
}

async function generatePayload(id, prompt, title, cost) {
  const number = await generateNumber();
  console.log(`Trying ${number}`);
  return [
    {
      operationName: "RedeemCustomReward",
      variables: {
        input: {
          channelID: channelID,
          rewardID: id,
          title,
          cost,
          prompt,
          textInput: number.toString(),
          transactionID: "aa71cbb5cd22e9165ah92a" + (Math.random() + 1).toString(36).substring(2),
        },
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: "d56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42",
        },
      },
    },
  ];
}

async function postData(url = "", data = {}, authorization = "", headers = "") {
  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth ${authorization}`,
        ...headers,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(`POST request failed: ${error}`);
    });
}

async function getData(url = "", headers) {
  return axios
    .get(url, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(`GET request failed: ${error}`);
    });
}

async function main() {
  const rewardData = await getChannelRewardData();
  const { id, isEnabled, isInStock, isPaused, prompt, title, cost } = rewardData;
  while (isEnabled && isInStock && !isPaused) {
    const payload = await generatePayload(id, prompt, title, cost);

    console.log("Request: ", JSON.stringify(payload));

    let response = await postData(TWITCH_URL, payload, token);

    console.log("Response: ", JSON.stringify(response));

    await timer(1000);
  }
}

main();
