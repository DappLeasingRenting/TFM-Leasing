var Cliente = artifacts.require("./Cliente.sol");

module.exports = function(deployer) {
  deployer.deploy(Cliente);  
};
