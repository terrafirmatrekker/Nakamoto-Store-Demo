// Migrating from one state to Another https://bit.ly/3yXrKLr

const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
