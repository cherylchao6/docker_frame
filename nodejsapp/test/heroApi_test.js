require("dotenv").config();
const { assert, requester } = require("./set_up");
const { heroes, heroesWithProfile } = require("./fake_data");

describe("hero", function () {
  it("get all heroes without profile", async () => {
    const res = await requester
      .get('/heroes');
    const resData = res.body;
    const expectData = {
      heroes:heroes
    }
    assert.deepEqual(resData, expectData);
    assert.equal(res.statusCode, 200);
  });
  it("get single heroe without profile", async () => {
    const res = await requester
      .get('/heroes/1')
    const resData = res.body;
    const expectData = heroes[0];
    assert.deepEqual(resData, expectData);
    assert.equal(res.statusCode, 200);
  });
  it("get all heroes with profile", async () => {
    const res = await requester
      .get('/heroes')
      .set('Name', 'hahow')
      .set('Password', 'rocks')
    const resData = res.body;
    const expectData = {
      heroes:heroesWithProfile
    }
    assert.deepEqual(resData, expectData);
    assert.equal(res.statusCode, 200);
  });
  it("get single hero with profile", async () => {
    const res = await requester
      .get('/heroes/1')
      .set('Name', 'hahow')
      .set('Password', 'rocks')
    const resData = res.body;
    const expectData = heroesWithProfile[0];
    assert.deepEqual(resData, expectData);
    assert.equal(res.statusCode, 200);
  });
});