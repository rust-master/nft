const Emoji = artifacts.require("Emoji");

module.exports = function (deployer) {
  deployer.deploy(Emoji);
};
