const express = require('express');
const authController = require('../../../controllers/auth.controller');
const ticketController = require('../../../controllers/ticket.controller')
const isAuthorized =require('../../../middleware/auth/validation') 
const notificationController = require('../../../controllers/notification.controller');
const router = express.Router()
//--------------------------- signup / login router------------------
router.post('/user/signup',authController.signup)
router.post('/user/login',authController.signin);
//-------------------------------- user find router--------------------
router.get('/user/all',isAuthorized.verifyToken,authController.findAlluser);
router.put('/user/update',isAuthorized.verifyToken,authController.updateUser)
//---------------------------------ticket router-------------------------
router.post('/ticket/create',isAuthorized.verifyToken,ticketController.createTicket);
router.delete('/ticket/delete',isAuthorized.verifyToken,ticketController.deleteTicket);
router.get('/ticket/all',isAuthorized.verifyToken,ticketController.findAllTickets);
router.get('/ticket/:id',isAuthorized.verifyToken,ticketController.getOneTicketbyId);
router.put('/ticket/update',isAuthorized.verifyToken,ticketController.updateTicket);
//---------------------------------Notification routers---------------------------------
router.post('/notification/send',notificationController.postNotification);
router.get('/notification/view/:id',notificationController.getNotification);
module.exports = router