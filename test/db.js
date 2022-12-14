const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let mongod;
exports.connect = async ()=>{
    if(!mongod){
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri();
       await mongoose.connect(uri);
    }

}

exports.clearDatabase = async ()=>{
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        await collection.deleteMany()
    }
}

exports.closeDatabase = async ()=>{
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if(mongod){
        await mongod.stop()
    }
}