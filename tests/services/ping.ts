import { expect } from "chai";
import * as pingService from "../../src/services/ping";

describe("Service - Ping", () => {
  it("Get", () => {
    const res = pingService.getPing();
    expect(res).to.have.property("message");
    expect(res.message).to.equal("Pong!");
  });
});
