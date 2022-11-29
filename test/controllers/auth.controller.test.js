const {signin , signup} = require('../../controllers/auth.controller');
const  userModel = require('../../Models/user.model');
const {mockRequest,mockResponse}= require('../interceptor')
const {connect,clearDatabase,closeDatabase} = require('../db')

const testPayload = {
    userType:'CUSTOMER',
    password:'123456',
    name:"Test",
    userId:"1",
    email:"test@gmail.com",
    ticketsCreated:[],
    ticketsAssigned:[]
}
beforeAll(async ()=> await connect());
beforeEach(async ()=> await clearDatabase())
afterAll(async ()=>await closeDatabase())
describe('signup',()=>{
    it('success',async ()=>{
        //Arrange
const req = mockRequest()
const res =mockResponse()
req.body = testPayload;      //act
 await signup(req,res)
        //Assert
        expect(res.status).toBeCalledWith(201);
        expect(res.send).toBeCalledWith(
            expect.objectContaining({
                userType: 'CUSTOMER',
                name: "Test",
                userId: "1",
                email: 'test@relevel.com',
                userStatus: 'PENDING',
            })
        )
    })
})