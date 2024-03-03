import { createClient } from "redis";

let client;

async function connect() {
    client = createClient();
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
}

async function setUserMapping(socketId, userId) {
    await client.set(userId, socketId);
}

async function unsetUserMapping(userId) {
    const response = await client.del(userId);
    if (response === 1) {
        console.log("Mapping Deleted Successfully");
    } else {
        console.log("No mapping found for deletion");
    }
}

async function getUserMapping(userId) {
    const socketId = await client.get(userId);
    return socketId;
}

export { connect, getUserMapping, setUserMapping, unsetUserMapping };
