const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "USS Enterprise",
    rocket: "NCC 1701-D",
    target: "Kepler-1453 f",
    launchDate: "January 4, 2028",
  };

  const launchDataWithoutDate = {
    mission: "USS Enterprise",
    rocket: "NCC 1701-D",
    target: "Kepler-1453 f",
  };

  test("It should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  // test("It should catch missing required properties", async () => {
  //   const incompleteLaunchData = {
  //     mission: "USS Enterprise",
  //     rocket: "NCC 1701-D",
  //   };

  //   const response = await request(app)
  //     .post("/launches")
  //     .send(incompleteLaunchData)
  //     .expect("Content-Type", /json/)
  //     .expect(400);

  //   expect(response.body).toStrictEqual({
  //     error: "Missing required launch property",
  //   });
  // });

  test("It should catch invalid dates", async () => {
    const invalidDateLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1453 f",
      launchDate: "not a date",
    };

    const response = await request(app)
      .post("/launches")
      .send(invalidDateLaunchData)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});