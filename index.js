(async function () {
  "use strict";

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

  var data = [
    {
      operationName: "SendHighlightedChatMessage",
      variables: {
        input: {
          channelID: "124422593",
          cost: 800,
          message: "KEKW",
          transactionID: "aa71cbb5cd22e9165ah92a1525b03120",
        },
      },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash:
            "bb187d763156dc5c25c6457e1b32da6c5033cb7504854e6d33a8b876d10444b6",
        },
      },
    },
  ];
  var url = "https://gql.twitch.tv/gql";
  var authToken = "024n0op1qbucpyk7rjg7g0mwqefyzn";

  var response = await postData(url, data, authToken);
  console.log(response);

  window.addEventListener("load", async function () {
    setTimeout(async function () {
      function setMessage() {
        const textBox = Array.from(
          document.getElementsByTagName("textArea")
        )[0];
        textBox.value = Math.floor(Math.random() * (999999 - 1)) + 1;
      }
      for (var i = 0; i < 3; i++) {
        function timer(ms) {
          return new Promise((res) => setTimeout(res, ms));
        }
        getButton().click();
        getGuessButton().click();
        getSendButton().click();
        setMessage();
        console.log("poggy");
        await timer(3000);
      }
    }, 3000);
  });
})();
