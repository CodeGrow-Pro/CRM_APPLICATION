const {mockRequest , mockResponse} = require('../../interceptor');
const {createTicket,updateTicket,findAllTickets , deleteTicket , getOneTicketbyId} = require('../../../controllers/ticket.controller');
const userModel = require('../../../Models/user.model');
const client = require("../../../utils/notificationClient");
const {connect,clearDatabase,closeDatabase} = require('../../db');
const ticketModel = require('../../../Models/ticket.model');
const objectConverter = require('../../../objectConverter/ticketCanverter')
beforeAll(async ()=>await connect());
beforeEach(async  ()=> await clearDatabase())
afterAll(async ()=>await closeDatabase())
const ticketCreateTestPayload ={
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
   }
   const userTestPayload = {
    userType:"CUSTOMER",
    password:"12345678",
    name: "Test",
    userId: 1,
    email: "test@relevel.com",
    ticketsCreated: [],
    ticketsAssigned: [],
    save: jest.fn()
   }
   
describe('createTicket',()=>{
    it('should pass the create ticket ok',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        // const sendEmailSpy= jest.spyOn(client,'post').mockImplementation((url,arg,callback)=>{
        //     callback('test',null);
        // })
       const req = mockRequest()
       const res = mockResponse()
        req.body = {
            title: "Test",
            ticketPriority: 4,
            description: "Test",
            reporter: 1,
            assignee: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        req.userId = "1";
        //act
         await createTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        // expect(sendEmailSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ticket creating Successfully!",
                success: true
            })
        )
    })
    it('should pass the create ticket without engineer',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(userTestPayload);
        // const sendEmailSpy= jest.spyOn(client,'post').mockImplementation((url,arg,callback)=>{
        //     callback('test',null);
        // })
       const req = mockRequest()
       const res = mockResponse()
        req.body = {
            title: "Test",
            ticketPriority: 4,
            description: "Test",
            status: "OPEN",
            reporter: 1,
            assignee: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        req.userId = "1";
        //act
         await createTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        // expect(sendEmailSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ticket creating Successfully!",
                success: true
            })
        )
    })
    it('should fails if create ticket without title ok ',async ()=>{
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            ticketPriority: 4,
            description: "Test",
            status: "OPEN",
            reporter: 1,
            assignee: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        req.userId = "1";
        //act
        await createTicket(req,res);
        //asserts
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "title not found"
            })
        )
    })
    it('should fail if ticket create without description ok',async ()=>{
        //arrange
        const req = mockRequest();
        const res = mockResponse();
        req.userId = "1";
        req.body = {
            title: "Test",
            ticketPriority: 4,
            status: "OPEN",
            reporter: 1,
            assignee: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        //act
        await createTicket(req,res);
        //assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "description not found"
            })
        )
    })
    it('should fails due to user not found ok',async ()=>{
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(()=>{throw new Error()});
        const req = mockRequest();
        const res = mockResponse();
        req.body = ticketCreateTestPayload;
        req.userId = "1";
        //act
        await createTicket(req,res);
        //asserts

        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: " error in Ticket creating",
                success: false
            })
        )
    })
    it('should fail for engineer finding error',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockImplementation(()=>{throw new Error('error occuring!')});
       const req = mockRequest()
       const res = mockResponse()
        req.body = {
            title: "Test",
            ticketPriority: 4,
            description: "Test",
            status: "OPEN",
            reporter: 1,
            assignee: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        req.userId = "1";
        //act
         await createTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Internal error!"
            })
        )
    })
});

describe('find tickets testing ',()=>{
    it('findAllTickets should be pass ok',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload))
        const tiketSpy = jest.spyOn(ticketModel,'find').mockReturnValue([ticketCreateTestPayload])
         const req = mockRequest();
         const res = mockResponse();
         req.userId = "1";

        //act
await findAllTickets(req,res)
        //asserts
        expect(tiketSpy).toHaveBeenCalled()
        expect(userSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message:"Fetch ticket Successfully!",
                success:true,
                ticketSummry:expect.arrayContaining([
                    expect.objectContaining({
                        title: "Test",
                        ticketPriority: 4,
                        description: "Test",
                        status: "OPEN",
                        reporter: 1,
                        assignee: 1
                    })
                ])
            })
        )
    }) 
    it('should pass get ticket by id ok',async ()=>{
        //arrange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        const ticketSpy = jest.spyOn(ticketModel,'findOne').mockReturnValue(Promise.resolve({
           title: "Test",
           _id:1,
           ticketPriority: 4,
           description: "Test",
           status: "OPEN",
           reporter: 1,
           assignee: 1
        }))
        const objectConvertSpy = jest.spyOn(objectConverter,'OneTicketObject').mockReturnValue(     {title: "Test",
        _id:1,
        ticketPriority: 4,
        description: "Test",
        status: "OPEN",
        reporter: 1,
        assignee: 1
     })
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = "1";
        req.userId = "1";
        //act
        await  getOneTicketbyId(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(objectConvertSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
           expect.objectContaining({
               message: "Data fetch successfully!",
               success: true,
               ticketDetails:expect.objectContaining({
                   title: "Test",
                   _id:1,
                   description: "Test",
                   status: "OPEN",
                   reporter: 1,
                   assignee: 1
               })
           })
        )
   })
   it('should fail duee to ticket id not found ok',async ()=>{
       //arrange
       const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload));
             const req = mockRequest();
       const res = mockResponse();
       req.userId = "1";
       //act
       await  getOneTicketbyId(req,res);
       //asserts
       expect(userSpy).toHaveBeenCalled();
       expect(res.status).toHaveBeenCalledWith(401);
       expect(res.send).toHaveBeenCalledWith(
          expect.objectContaining({
           message: "Please pass the ticket ID as a Parametar!",
           success: false
          })
       )
  })

})

