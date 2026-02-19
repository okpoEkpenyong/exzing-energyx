const CarbonCredit = artifacts.require("CarbonCredit");

contract("CarbonCredit", accounts => {
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  it("should mint credits to user", async () => {
    const instance = await CarbonCredit.deployed();
    await instance.mint(user1, 100);
    const balance = await instance.balanceOf(user1);
    assert.equal(balance.toNumber(), 100);
  });

  it("should transfer credits", async () => {
    const instance = await CarbonCredit.deployed();
    await instance.transfer(user2, 50, {from: user1});
    const balance1 = await instance.balanceOf(user1);
    const balance2 = await instance.balanceOf(user2);
    assert.equal(balance1.toNumber(), 50);
    assert.equal(balance2.toNumber(), 50);
  });

  it("should burn credits", async () => {
    const instance = await CarbonCredit.deployed();
    await instance.burn(25, {from: user1});
    const balance = await instance.balanceOf(user1);
    assert.equal(balance.toNumber(), 25);
  });
});