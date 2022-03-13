import { expect } from "chai";
import { port as expressPort } from "../../../../src/index";
require("isomorphic-fetch");

describe("Route api/feed", () => {
  it("Get Feeds with no params", async () => {
    const res = await fetch(`http://localhost:${expressPort}/api/feed`);
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.be.an("array");
    expect(body).to.have.length(50);
    expect(body[0]).to.have.property("name");
    expect((body[0] as { name: string }).name).to.equal(
      "Customer Assurance Liaison"
    );
  });
  it("Get Feeds with page size 20 and current page 1", async () => {
    const res = await fetch(
      `http://localhost:${expressPort}/api/feed?pageSize=20`
    );
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.be.an("array");
    expect(body).to.have.length(20);
    expect(body[0]).to.have.property("name");
    expect((body[0] as { name: string }).name).to.equal(
      "Customer Assurance Liaison"
    );
  });
  it("Get Feeds with page size 10 and current page 2", async () => {
    const res = await fetch(
      `http://localhost:${expressPort}/api/feed?pageSize=20`
    );
    expect(res.status).to.equal(200);
    const body = await res.json();
    expect(body).to.be.an("array");
    expect(body).to.have.length(10);
    expect(body[0]).to.have.property("name");
    expect((body[0] as { name: string }).name).to.equal(
      "Regional Intranet Developer"
    );
  });
  it("Get Feeds with sort true and no sort params", async () => {
    const res = await fetch(
      `http://localhost:${expressPort}/api/feed?shouldSort=true`
    );
    expect(res.status).to.equal(400);
  });
  it("Get Feeds with invalid pagination params", async () => {
    const res = await fetch(
      `http://localhost:${expressPort}/api/feed?currentPage=wrong`
    );
    expect(res.status).to.equal(400);
  });
});
