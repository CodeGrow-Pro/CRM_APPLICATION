const {mockRequest , mockResponse} = require('../../interceptor');
const {updateTicket} = require('../../../controllers/ticket.controller');
const userModel = require('../../../Models/user.model');
const client = require("../../../utils/notificationClient").client;
const {connect,clearDatabase,closeDatabase} = require('../../db');
const ticketModel = require('../../../Models/ticket.model');
const objectConverter = require('../../../objectConverter/ticketCanverter');
const tiketModel = require('../../../Models/ticket.model');
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
    updatedAt: Date.now(),
    save:jest.fn()
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
   describe(' the  update tickets !',()=>{
 it('update ticket successfully should pass', async ()=>{
    const userSpy = jest.spyOn(userModel,'findOne').mockReturnValue(Promise.resolve(userTestPayload))
    const ticketSpy = jest.spyOn(tiketModel,'findOne').mockReturnValue(Promise.resolve(ticketCreateTestPayload));
    const ticketUpdateSpy = jest.spyOn(ticketModel,'findOneAndUpdate').mockReturnValue(Promise.resolve(ticketCreateTestPayload))
    const req = mockRequest();
    const res = mockResponse();
    req.query.status = 'OPEN';
    req.body.id = 1;
    req.body.description = "testing successfull!"
    //act
   await updateTicket(req,res);
   //asserts
   expect(userSpy).toHaveBeenCalled();
   expect(ticketSpy).toHaveBeenCalled();
   expect(res.status).toHaveBeenCalledWith(201)
   expect(res.send).toHaveBeenCalledWith(
    expect.objectContaining({
        message:"Update successfully!",
            success:true,
            BeforeUpdateing : expect.objectContaining(ticketCreateTestPayload)
    })
   )
 }) 
   })
   