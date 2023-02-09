import express, { json, Request, Response } from "express";
import "express-async-errors";
import gamesRouter from "./routers/games-router";
import consolesRouter from "./routers/consoles-router";
import { PrismaClient } from '@prisma/client';
import { Express } from "express";

const app = express();
app.use(json());

app.get("/health", (req: Request, res: Response) => res.send("I'am alive!"));
app.use(gamesRouter);
app.use(consolesRouter);

export let prisma: PrismaClient;
export function connectDb(): void {
    prisma = new PrismaClient();
}

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(app);
}

export default app;
