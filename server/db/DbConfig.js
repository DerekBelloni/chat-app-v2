import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connection.on("error", err => {
    console.error('[DATABASE ERROR]: ', err);
});

mongoose.connection.on("connection", () => {
    console.log('Database Connection Successful');
});

export class DbConnection {
    static async connect(connectionString = process.env.MONGO_CONNECTION_STRING || '') {
        let status = 0;
        try {
            const status = await mongoose.connect(connectionString);
            console.log('[CONNECTION TO DB SUCCESSFUL]');
            return status;
        } catch (e) {
            console.error('[MONGOOSE CONNECTION ERROR]: ', 'Invalid Connection String');
            return status;
        }
    }
}

export default DbConnection;