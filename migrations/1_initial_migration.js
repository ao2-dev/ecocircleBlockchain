const Migrations = artifacts.require("Migrations");
const Token=artifacts.require("Token");
const Test=artifacts.require("Test");

module.exports = function (deployer) {
  console.log(`=======deployer======`)
console.log(deployer);
  // deployer.deploy(Migrations);
  deployer.deploy(Token,1000000, "Eco_Circle", "ECC").then(function(){
    console.log(`Deploying TokenContract is success`)
    console.log(Token.address);
  })
  // deployer.deploy(Test).then(function(){
  //   console.log(`Deploying TestContract is success`)
  //   console.log(Test.address);
  // })
};


