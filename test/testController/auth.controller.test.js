const {signin,signup} = require('../../controllers/auth.controller');
const userModel = require('../../Models/user.model');
const {mockRequest, mockResponse} = require('../interceptor');
const {connect,clearDatabase,closeDatabase} = require('../db');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const customerTestPayload = {
    name: "test",
        userId: 10,
        email: "test@gmail.com",
        userType: "CUSTOMER",
        userStatus:"APPROVED",
        password:"test",
        ticketsCreated:[],
        ticketsAssigned:[]
}
const  engineerTestpayload = {
    name: "test1",
        userId: 20,
        email: "test1@gmail.com",
        userType: "ENGINEER",
        userStatus:"PENDING",
        password:"test1",
        ticketsCreated:[],
        ticketsAssigned:[]
}
const  AdminTestpayload = {
    name: "test2",
        userId: 30,
        email: "test2@gmail.com",
        userType: "ADMIN",
        userStatus:"APPROVED",
        password:"test2",
        ticketsCreated:[],
        ticketsAssigned:[]
}
beforeAll(async ()=> await connect());
beforeEach(async ()=> await clearDatabase())
afterAll(async ()=>await closeDatabase())

describe('signup auth test',()=>{
    it('Should pass the signup user',async ()=>{
        //arrange
        const req = mockRequest();
        const res = mockResponse()
        req.body = customerTestPayload;
        //act
          await signup(req,res)
        //asserts
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message:"signup sucessfully!",
            success:true
            })
        )
    })
    it('Should pass the signup as user status pending',async ()=>{
        //arrange 
        const req = mockRequest();
        const res = mockResponse()
        req.body = engineerTestpayload;
        //act
          await signup(req,res)
        //asserts
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message:"signup sucessfully!",
            success:true
            })
        )
    })
    it('Should fail in signup user',async ()=>{
        //arrange
         const userSpy = jest.spyOn(userModel,'create').mockImplementation(()=>{throw new Error('error occuring')});
         const req = mockRequest();
         const res = mockResponse();
         req.body = customerTestPayload;

        //act
          await signup(req,res);

        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Internal server error!',
                success:false
            })
        )
    })
})
describe('signin auth test',()=>{
    it('should pass signin ',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(customerTestPayload)
         const bcryptSpy = jest.spyOn(bcrypt,'compareSync').mockReturnValue(true);
         const req = mockRequest();
         const res = mockResponse();
         req.body = {
            userId:10,
            password:"test"
         };

        //act
        await signin(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled()
        expect(bcryptSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                    name: customerTestPayload.name,
                    userId: customerTestPayload.userId,
                    email: customerTestPayload.email,
                    userTypes: customerTestPayload.userType,
                    userStatus: customerTestPayload.userStatus
            })
        )
    })
    it('should fail due to pending status',async ()=>{
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(engineerTestpayload));
        const bcryptSpy = jest.spyOn(bcrypt,'compareSync').mockReturnValue(true)
        const req = mockRequest();
        const res = mockResponse();
        req.body = engineerTestpayload;
        //act
        await signin(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toBeCalled()
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Your are not Approved Wait some time ",
                Status:'PENDING'
            })
        )
    })

})
describe('signin test 2',()=>{
 
    it('should fail due to some other error',async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        req.body = customerTestPayload
        const userSpy = jest.spyOn(userModel,'findOne').mockImplementation(()=>{throw  Error('Error occuring!')})

        //act
        await signin(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "User not found!",
                success:false
            })
        )
    })
})
// describe('password misMatch in signin',()=>{
//     it('should fail due to password misMatch',async ()=>{
//         const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(customerTestPayload));
//         const bcryptSpy = jest.spyOn(bcrypt,'compareSync').mockReturnValue(false)
//         const req = mockRequest();
//         const res = mockResponse();
//         req.body = {
//             userId:10,
//             password:"wrong"
//         };
//         //act
//         await signin(req,res);
//         //asserts
//         expect(userSpy).toHaveBeenCalled();
//         expect(bcryptSpy).toBeCalled()
//         expect(res.status).toHaveBeenCalledWith(401);
//         expect(res.send).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 message: "Invalied password",
//                 success:false
//             })
//         )
//     })
// })