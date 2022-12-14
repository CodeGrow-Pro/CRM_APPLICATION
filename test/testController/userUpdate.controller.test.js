const {updateUser} = require('../../controllers/auth.controller');
const userModel = require('../../Models/user.model');
const {mockRequest, mockResponse} = require('../interceptor');
const {connect,clearDatabase,closeDatabase} = require('../db');
const converter= require('../../objectConverter/userObjectConverter')
const customerTestPayload = {
    name: "test",
        userId: 10,
        email: "test@gmail.com",
        userType: "CUSTOMER",
        userStatus:"APPROVED",
        password:"test",
        ticketsCreated:[],
        ticketsAssigned:[],
        save:jest.fn()
}
const  engineerTestpayload = {
    name: "test1",
        userId: 20,
        email: "test1@gmail.com",
        userType: "ENGINEER",
        userStatus:"PENDING",
        password:"test1",
        ticketsCreated:[],
        ticketsAssigned:[],
        save:jest.fn()
}
const  AdminTestpayload = {
    name: "test2",
        userId: 30,
        email: "test2@gmail.com",
        userType: "ADMIN",
        userStatus:"APPROVED",
        password:"test2",
        ticketsCreated:[],
        ticketsAssigned:[],
        save:jest.fn()
}


describe('update user',()=>{
    it('should pass update user email',async ()=>{
         const req = mockRequest();
         const res = mockResponse();
         req.body.email = 'vishal@gmail.com';
         req.userId = 10;
         const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(customerTestPayload));
         const convertSpy = jest.spyOn(converter,'OneUserConverter').mockReturnValue(customerTestPayload )
         //act
         await updateUser(req,res);
         //asserts
         expect(userSpy).toHaveBeenCalled();
         expect(convertSpy).toHaveBeenCalled()
         expect(res.status).toHaveBeenCalledWith(201);
         expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
            message:"Update SuccessFully !",
                success:true,
                updatedDetails :  expect.objectContaining(customerTestPayload)
        })
         )
    })
    it('should pass update user userType',async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        req.body.userType = 'ADMIN';
        req.userId = 10;
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(customerTestPayload));
        const convertSpy = jest.spyOn(converter,'OneUserConverter').mockReturnValue(customerTestPayload )
        //act
        await updateUser(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(convertSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
       expect.objectContaining({
           message:"Update SuccessFully !",
               success:true,
               updatedDetails :  expect.objectContaining(customerTestPayload)
       })
        )
   })
   it('should fail update user without update data',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    req.userId = 10;
    const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(customerTestPayload));
    //act
    await updateUser(req,res);
    //asserts
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
   expect.objectContaining({
    message:"Please provide the Data for update!",
    success:false 
})
)
})
it('should fail update due to other error',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    req.userId = 10;
    const userSpy = jest.spyOn(userModel,'findOne').mockImplementation(cb => cb(new
Error("This is an error."), null));
    //act
    await updateUser(req,res);
    //asserts
    expect(userSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
   expect.objectContaining({
    message:"Something Want Wrong!",
    success:false
})
)
})
})