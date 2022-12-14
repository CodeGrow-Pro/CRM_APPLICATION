const {signin,findAlluser} = require('../../controllers/auth.controller');
const userModel = require('../../Models/user.model');
const {mockRequest, mockResponse} = require('../interceptor');
const {connect,clearDatabase,closeDatabase} = require('../db');
const converter= require('../../objectConverter/userObjectConverter')
const  bcrypt = require('bcrypt')
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

describe('password misMatch in signin',()=>{
    it('should fail due to password misMatch',async ()=>{
      const req = mockRequest();
        const res = mockResponse();
        req.body = {
            userId:10,
            password:"wrong"
        };
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(customerTestPayload));
        const bcryptSpy = jest.spyOn(bcrypt,'compareSync').mockReturnValue(false)
    
        //act
        await signin(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(bcryptSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Invalied password",
                success:false
            })
        )
    })
})

describe('find all user',()=>{
  it('should pass fetch all user',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const userSpy = jest.spyOn(userModel,'find').mockImplementation(()=>({
        exec : jest.fn().mockReturnValue(Promise.resolve([customerTestPayload]))
    }))
    const convertSpy = jest.spyOn(converter,'multiConverter').mockReturnValue([customerTestPayload])
    //act
    await findAlluser(req,res);
    //asserts
    expect(userSpy).toHaveBeenCalled();
    expect(convertSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
        expect.arrayContaining([
            expect.objectContaining({
                name: customerTestPayload.name,
                userId:customerTestPayload.userId,
                email: customerTestPayload.email,
                userType: customerTestPayload.userType,
                userStatus: customerTestPayload.userStatus,
                ticketsCreated:customerTestPayload.ticketsCreated,
                ticketsAssigned:customerTestPayload.ticketsAssigned
            })
        ])
    )
  })
  it('should fail fetch all user',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const userSpy = jest.spyOn(userModel,'find').mockImplementation(()=>({
        exec : jest.fn().mockImplementation( ()=> {throw new Error("This is an error.")})
    }))
    //act
    await findAlluser(req,res);
    //asserts
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
            message:"something want wrong!",
            success:false
        })
    )
  })
})