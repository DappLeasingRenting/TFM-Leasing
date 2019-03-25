var Cliente = artifacts.require("./Cliente.sol");
var Token = artifacts.require("./Token.sol");
var CompraToken = artifacts.require("./CompraToken.sol");



module.exports = function(deployer, network, accounts) {
  deployer.deploy(Cliente, { from: accounts[9], gas:6721975, value: 500000000000000000 });  
  deployer.deploy(Token, 1000000).then(function() {
    // Token price is 0.001 Ether
    var PrecioToken = 1000000000000000;
    return deployer.deploy(CompraToken, Token.address, PrecioToken);
  });
};
