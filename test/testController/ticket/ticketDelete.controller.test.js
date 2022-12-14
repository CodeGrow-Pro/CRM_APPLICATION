const {mockRequest , mockResponse} = require('../../interceptor');
const {createTicket,updateTicket,findAllTickets , deleteTicket} = require('../../../controllers/ticket.controller');
const userModel = require('../../../Models/user.model');
const client = require("../../../utils/notificationClient").client;
const {connect,clearDatabase,closeDatabase} = require('../../db');
const ticketModel = require('../../../Models/ticket.model');

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
describe('should pass ticket delete successfully!',()=>{
    it('ticket delete successfully!',async ()=>{
        //arange
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload));
        const ticketDeleteSpy = jest.spyOn(ticketModel,'deleteOne').mockReturnValue({
            exec : jest.fn().mockReturnValue({
                Acknowledgement:true,
                deleteCount:1
            })
        })
        const req = mockRequest();
        const res = mockResponse();
        req.body.id = 1;
        req.userId = 1;
        //act
        await deleteTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(ticketDeleteSpy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Ticket Deleted Successfully!",
                success: true,
                deleteSummry: expect.objectContaining({
                    Acknowledgement:true,
                    deleteCount:1
                })
            })
        )
    })
    it('should fail due to ticket not found!',async ()=>{
        const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(userTestPayload)
        const ticketDeleteSpy = jest.spyOn(ticketModel,'deleteOne').mockReturnValue({
            exec : jest.fn().mockImplementation(()=>{throw new Error('user not found')})
        })
        const req = mockRequest();
        const res = mockResponse();
        req.userId = 1;
        req.body.id = 1;
        //act
        await deleteTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(ticketDeleteSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "something want wrong!",
               success: false
            })
        )
    })
    it('should fail due to user not found!',async ()=>{
        const userSpy = jest.spyOn(userModel,'findOne').mockImplementation(()=>{throw new Error('user not found')})
        const ticketDeleteSpy = jest.spyOn(ticketModel,'deleteOne').mockReturnValue({
            exec : jest.fn().mockReturnValue(ticketCreateTestPayload)
        })
        const req = mockRequest();
        const res = mockResponse();
        req.userId = 1;
        req.body.id = 1;
        //act
        await deleteTicket(req,res);
        //asserts
        expect(userSpy).toHaveBeenCalled();
        expect(ticketDeleteSpy).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "something want wrong!",
               success: false
            })
        )
    })
})