import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI);

async function getToken() {
    try {
        // Find the most recent user created
        const user = await User.findOne().sort({ createdAt: -1 });
        if (user) {
            console.log(user.verificationToken);
        } else {
            console.log("NO_USER");
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}

getToken();
