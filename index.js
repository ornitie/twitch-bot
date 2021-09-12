(async function () {
  "use strict";

  const channelID = "95416766";
  const TWITCH_URL = "https://gql.twitch.tv/gql";

  function generatePayload() {
    return [
      {
        operationName: "RedeemCustomReward",
        variables: {
          input: {
            channelID: channelID,
            rewardID: "055d3993-f7d6-416a-b403-7a8265da99de",
            title: "Guess a number 1 - 1 million",
            cost: 1,
            prompt:
              "Guess the correct number and win $1900!  Make sure your message is ONLY the number you wish to guess, no commas, letters, decimals etc.",
            textInput: (
              Math.floor(Math.random() * (999999 - 1)) + 1
            ).toString(),
            transactionID:
              "aa71cbb5cd22e9165ah92a" +
              (Math.random() + 1).toString(36).substring(2),
          },
        },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash:
              "d56249a7adb4978898ea3412e196688d4ac3cea1c0c2dfd65561d229ea5dcc42",
          },
        },
      },
    ];
  }

  function getAuthorization() {
    return document.cookie
      .split("; ")
      .find((element) => element.startsWith("auth-token"))
      .split("=")[1];
  }

  async function postData(url = "", data = {}, authorization = "") {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth ${authorization}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  window.addEventListener("load", async function () {
    setTimeout(async function () {
      for (var i = 0; i < 1000; i++) {
        function timer(ms) {
          return new Promise((res) => setTimeout(res, ms));
        }
        let response = await postData(
          TWITCH_URL,
          generatePayload(),
          getAuthorization()
        );

        console.log(response);

        await timer(3000);
      }
    }, 3000);
  });
})();
