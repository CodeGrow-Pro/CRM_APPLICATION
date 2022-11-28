const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let mongod;
exports.connect = async ()=>{
    if(!mongod){
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri();
        mongoose.connect(uri);
    }

}

exports.clearDatabase = async ()=>{
    const collections = mongoose.connection.collections;
    for(const key in collections){
        const collection = collections[key];
        collection.deleteMany()
    }
}