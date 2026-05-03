
import mongoose from 'mongoose';

export const Connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@flipkart-clone.oljh3yy.mongodb.net/flipkart`;

    try {
        await mongoose.connect(URL);
        console.log('Database connected successfully');

        mongoose.connection.once("open", () => {
            console.log("🔥 Connected to DB:", mongoose.connection.name);
        });

    } catch(error) {
        console.log('Error while connecting the database', error.message);
    }
}

export default Connection;

