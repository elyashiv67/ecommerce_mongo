import mongoose from 'mongoose';

const connectDB = async () => {
    const db = mongoose.connection;

    // listeners are added before connecting, otherwise 'connected' already happened
    db.on('error', (err) => {
        console.log(err);
    });

    db.once('connected' , () => {
        console.log(`MongoDB Connected ✅ ✅`);
    });

    await mongoose.connect(process.env.DB);
}

export default connectDB;
