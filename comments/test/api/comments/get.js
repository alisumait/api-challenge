require("dotenv").config();
process.env.NODE_ENV = "test";

const app = require("../../../src/app.js");
const conn = require("../../../src/db/index.js");
const expect = require("chai").expect;
const request = require("supertest");

describe("GET /orgs/:org/comments", () => {
  before(done => {
    conn
      .connectTestDatabase()
      .then(() => {
        done();
      })
      .catch(err => done(err));
  });

  beforeEach(done => {
    conn
      .clearTestDatabase()
      .then(() => done())
      .catch(err => done(err));
  });

  after(done => {
    conn
      .closeTestDatabse()
      .then(() => done())
      .catch(err => done(err));
  });

  // send GET request to an invalid organization on Github e.g. 000
  it("Get comments from a non-existing organization", done => {
    request(app)
      .get("/orgs/000/comments")
      .then(res => {
        const body = res.body;
        expect(body).to.have.property("error");
        done();
      })
      .catch(err => done(err));
  });

  // send GET request to a valid organization after posting a comment
  it("Get all comments from an organization", done => {
    request(app)
      .post("/orgs/xendit/comments")
      .send({
        comment: "Looking to hire SE Asia's top dev talent!"
      })
      .then(res => {
        request(app)
          .get("/orgs/xendit/comments")
          .then(res => {
            const body = res.body;
            expect(body[0].comments.length).to.equal(1);
            done();
          });
      })
      .catch(err => done(err));
  });
});
