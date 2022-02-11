import { Connection, createConnection } from "typeorm";
import * as request from 'supertest'
import app from "../../src/app";
import { port } from "../../src/config";
import { notDeepEqual } from "assert";

let connection, server;

const testUser = {
    firstName: "Mauricio",
    lastName: "Rubio",
    age: 23
}

beforeEach(async() => {
    connection = await createConnection();
    await connection.synchronize(true);
    server = app.listen(port);
});

afterEach(() => {
    connection.close();
    server.close();
})

it('Should be no users initially', async() => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
})

it('Should create a user', async() => {
    const response = await request(app).post('/users').send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({...testUser, id: 1});
})

it('Should not create a user if no firstName is given', async() => {
    const response = await request(app).post('/users').send({lastName: "Rochin", age: 21});
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).not.toBeNull();
})