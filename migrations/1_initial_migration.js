//const Token=artifacts.require("Token");
const EcoStatistic=artifacts.require("EcoStatistics");
module.exports = function (deployer) {
  console.log(`=======deployer======`)
console.log(deployer);
deployer.deploy(EcoStatistic).then(function(){
  console.log('Deploying EcoStatistics is success');
  console.log(EcoStatistic.address);
})
  // deployer.deploy(Token,1000000, "ecocircle", "ECC").then(function(){
  //   console.log(`Deploying TokenContract is success_by polygon network`)
  //   console.log(Token.address);
  // })
  // deployer.deploy(Test).then(function(){
  //   console.log(`Deploying TestContract is success`)
  //   console.log(Test.address);
  // })
};


