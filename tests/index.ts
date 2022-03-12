import { expect } from "chai";
import { session as expressSession, port as expressPort } from "../src/index";
require("isomorphic-fetch");

describe("Express test", () => {
  it("Is express app listening?", async () => {
    const res = await fetch(`http://localhost:${expressPort}/ping`);
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.have.property("message");
    expect((body as { message: unknown }).message).to.equal("Pong!");
  });
  after(() => {
    expressSession.close();
  });
});
