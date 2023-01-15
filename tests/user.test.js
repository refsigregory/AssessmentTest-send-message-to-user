import request from "supertest";
import app from "../src/index";

let dataId

beforeAll( async () => {
  dataId = "asd"
})


describe("GET /users", () => {
  it("Showing user list", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
  });
});

describe("PUT /users", () => {
  it("Add new user with valid data", async () => {
    const payload = {
      firstName: "Foo",
      lastName: "Bar",
      email: "test@digitalenvision.com.au",
      birthday: "2020-01-01",
      location: "37.868989,139.991098"
    }
    const res = await request(app).put("/users").send(payload);
    dataId = res.body.data.User.id
    expect(res.statusCode).toBe(201);
  });

  it("Add new user with invalid", async () => {
    const payload = {
      firstName: "",
      lastName: "",
      email: "t",
      birthday: "",
      location: ""
    }
    const res = await request(app).post("/users").send(payload);
    expect(res.statusCode).toBe(404);
  });

  it("Add new user with no data", async () => {
    const payload = {
    }
    const res = await request(app).post("/users").send(payload);
    expect(res.statusCode).toBe(404);
  });
});

describe(`POST /users/{id}`, () => {
  it("Add new user with valid data", async () => {
    const payload = {
      firstName: "Bar",
      lastName: "Foo",
      email: "test@digitalenvision.com.au",
      birthday: "2020-01-01",
      location: "37.868989,139.991098"
    }
    const res = await request(app).post(`/users/${dataId}`).send(payload);
    expect(res.statusCode).toBe(200);
  });

  it("Add new user with invalid ID", async () => {
    const payload = {
      firstName: "Bar",
      lastName: "Foo",
      email: "test@digitalenvision.com.au",
      birthday: "2020-01-01",
      location: "37.868989,139.991098"
    }
    const res = await request(app).post(`/users/foo`).send(payload);
    expect(res.statusCode).toBe(500);
  });

  it("Add new user with invalid", async () => {
    const payload = {
      firstName: "",
      lastName: "",
      email: "t",
      birthday: "",
      location: ""
    }
    const res = await request(app).put(`/users/${dataId}`).send(payload);
    expect(res.statusCode).toBe(404);
  });

  it("Add new user with no data", async () => {
    const payload = {
    }
    const res = await request(app).put(`/users/${dataId}`).send(payload);
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /users", () => {
  it("Delete user with valid data", async () => {
    const res = await request(app).delete(`/users/${dataId}`);
    expect(res.statusCode).toBe(202);
  });

  it("Delete user with invalid ID", async () => {
    const res = await request(app).delete(`/users/${dataId}`);
    expect(res.statusCode).toBe(404);
  });
});