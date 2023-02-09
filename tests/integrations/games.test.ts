import supertest from "supertest";
import app from "app";
import { cleanDb } from "../helper";
import { init } from "app";
import { createConsole } from "../factories/console-factory";
import { createGame } from "../factories/game-factory";

beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

const server = supertest(app);

describe("GET games route", () =>{
    it("Should respond with status 200 and an array containing the game Objects ",async()=>{
        const createdConsole = await createConsole();
        await createGame(createdConsole.id);
        const response = await server.get("/games");
        const status = response.status;
        const body = response.body;
        expect(status).toBe(200);

        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                title: expect.any(String),
                consoleId: expect.any(Number),
            })
        ]));
    })
})

describe("GET games by id route", () =>{
    it("Should respond with status 404 if gameId not found in the datatable",async()=>{
        const response = await server.get("/games/0");
        const status = response.status;

        expect(status).toBe(404);
    })
    it("Should respond with status 200 and an Object containing the game",async()=>{
        const createdConsole = await createConsole();
        const createdGame = await createGame(createdConsole.id);
        const response = await server.get(`/games/${createdGame.id}`);
        const status = response.status;
        const body = response.body;

        expect(status).toBe(200);
        
        expect(body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
        }));
    })
})

describe("POST games route", () =>{
    it("Should respond with status 409 if game already registered in the datatable",async()=>{
        const createdConsole = await createConsole();
        const createdGame = await createGame(createdConsole.id);

        const response = await server.post("/games").send({title: createdGame.title, consoleId: createdConsole.id});
        expect(response.status).toBe(409);
    })
    it("Should respond with status 409 if console does not exist in the datatable",async()=>{
        const response = await server.post("/games").send({title: "New Game", consoleId:0});
        expect(response.status).toBe(409);
    })
    it("Should respond with status 201 when game was inserted",async()=>{
        const createdConsole = await createConsole();
        const response = await server.post("/games").send({title: "New Game", consoleId: createdConsole.id});
        expect(response.status).toBe(201);
    })
})
