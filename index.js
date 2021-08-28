(function () {
  "use strict";

  const RewardsButton = "Saldo de puntos";

  function getButton() {
    return Array.from(document.getElementsByTagName("button")).find(
      (element) => element.ariaLabel === RewardsButton
    );
  }

  getButton().click();
})();
