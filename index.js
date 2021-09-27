(async function () {
  "use strict";

  const channelID = "95416766";
  const clientID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
  const TWITCH_URL = "https://gql.twitch.tv/gql";
  const TWENTY_POO = "https://cpt-api.twentypoo.com/numberGuesses/";
  const COOKIE =
    "SID=s%3AVLtd_zk3K8ZHv70X4VZPJBe7tAv_0r2G.f6mUm2BeS1IKX7mpWxvcnO7jQqUDsl6W4%2FOMsdnPsSs";

  async function isNumberValid(number) {
    const data = await getData(`${TWENTY_POO}${number}`);

    return number.length == 0;
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

    const data = await postData(TWITCH_URL, payload, getAuthorization(), {
      "Client-Id": clientID,
    });

    const customReward =
      data[0]["data"]["community"]["channel"]["communityPointsSettings"]["customRewards"];

    const { id, isEnabled, isInStock, isPaused, prompt, title, cost } = customReward[0];

    return { id, isEnabled, isInStock, isPaused, prompt, title, cost };
  }

  async function generateNumber() {
    while (true) {
      const number = Math.floor(Math.random() * (999999 - 1)) + 1;
      const isValid = await isNumberValid(number);
      if (isValid) {
        return number;
      }
    }
  }

  function generatePayload(id, prompt, title, cost) {
    const number = await generateNumber();
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

  function getAuthorization() {
    return document.cookie
      .split("; ")
      .find((element) => element.startsWith("auth-token"))
      .split("=")[1];
  }

  async function postData(url = "", data = {}, authorization = "", headers = "") {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth ${authorization}`,
        ...headers,
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async function getData(url = "", headers) {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return response.json();
  }

  window.addEventListener("load", async function () {
    setTimeout(async function () {
      const rewardData = await getChannelRewardData();
      const { id, isEnabled, isInStock, isPaused, prompt, title, cost } = rewardData;
      while (isEnabled && isInStock && !isPaused) {
        function timer(ms) {
          return new Promise((res) => setTimeout(res, ms));
        }

        let response = await postData(
          TWITCH_URL,
          generatePayload(id, prompt, title, cost),
          getAuthorization()
        );

        console.log(response);

        await timer(3000);
      }
    }, 3000);
  });
})();
