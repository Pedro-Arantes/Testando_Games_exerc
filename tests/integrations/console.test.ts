import supertest from "supertest";
import app from "app";
import { cleanDb } from "../helper";
import { init } from "app";
import { createConsole } from "../factories/console-factory";


beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });

const server = supertest(app);

describe("GET consoles route", () =>{
    it("Should respond with status 200 and an array containing the console Objects ",async()=>{
        await createConsole();
        const response = await server.get("/consoles");
        const status = response.status;
        const body = response.body;
        
        expect(status).toBe(200);

        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            })
        ]));
        
    })
})

describe("GET console by id route", () =>{
    it("Should respond with status 404 if consoleId not found in the datatable",async()=>{
        const response = await server.get("/consoles/0");
        const status = response.status;

        expect(status).toBe(404);
    })
    it("Should respond with status 200 and an Object containing the console",async()=>{
        const createdConsole = await createConsole();
        const response = await server.get(`/consoles/${createdConsole.id}`);
        const status = response.status;
        const body = response.body;

        expect(status).toBe(200);
        
        expect(body).toEqual(expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            })
        );
    })
})

describe("POST console route", () =>{
    it("Should respond with status 409 if console already registered in the datatable",async()=>{
        const createdConsole = await createConsole();

        const response = await server.post("/consoles").send({name: createdConsole.name});

        expect(response.status).toBe(409);


    })
    it("Should respond with status 201 when console was inserted",async()=>{
        const response = await server.post("/consoles").send({name: "Novo console"});

        expect(response.status).toBe(201);
    })
})
