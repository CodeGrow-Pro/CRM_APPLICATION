const request = require('supertest');
const  app = require('../../server');
const db = require('../db');
// beforeEach(async ()=> await db.clearDatabase());
afterAll(async ()=> {
    await db.closeDatabase()
    await app.close()
});
const api_endPoint = '/crm/api/v1/';
const testPayload = {
    userType:"CUSTOMER",
    password:"12345678",
    name: "Test",
    userId: 2,
    email: "test@relevel.com",
    userStatus: "APPROVED",
    ticketsCreated: [],
    ticketsAssigned: []
   }
   describe('test Post signup routes!',()=>{
    it('user signup success',async ()=>{
        const res =await request(app)
        .post(api_endPoint+'/user/signup')
        .send(testPayload)
    expect(res.status).toEqual(201);
    expect(res.body).toEqual(
        expect.objectContaining({
            message:"signup sucessfully!",
            success:true
        })
    )
    })
   })
   describe('test Signin routes!',()=>{
    it('user signup successfully!',async ()=>{
        const res =await request(app)
        .post(api_endPoint+'/user/login')
        .send(testPayload)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual(
            expect.objectContaining({
                email: "test@relevel.com",
                name: "Test",
                userId: "2",
                userStatus: "APPROVED",
                userTypes:"CUSTOMER"
            })
        )
    })
   })
