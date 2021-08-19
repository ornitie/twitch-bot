(function () {
  "use strict";
  window.addEventListener("load", function () {
    setTimeout(async function () {
      const RewardsButton = "Saldo de puntos";

      function getButton() {
        return Array.from(document.getElementsByTagName("button")).find(
          (element) => element.ariaLabel === RewardsButton
        );
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
