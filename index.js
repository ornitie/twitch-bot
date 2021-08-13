(async function () {
  "use strict";
  window.addEventListener("load", async function () {
    setTimeout(async function () {
      const RewardsButton = "Saldo de puntos";

      for (var i = 0; i < 3; i++) {
        function timer(ms) {
          return new Promise((res) => setTimeout(res, ms));
        }
        console.log(i);
        await timer(3000);
      }
      function getButton() {
        return Array.from(document.getElementsByTagName("button")).find(
          (element) => element.ariaLabel === RewardsButton
        );
      }
        
        function setMessage(message){
        const textBox = Array.from(document.getElementsByTagName("textArea"))
        textBox.value = "KEKW";
        }

      function x() {
        console.log(":V");
      }

      getButton().click();
      x();
      console.log("YEAH");
    }, 3000);
  });
})();