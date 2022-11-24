const TicketModel = require('../Models/ticket.model')
const user = require('../Models/user.model')
const objConverter = require('../objectConverter/ticketCanverter');
const isValied = require('../constant/constant');
const { update } = require('../Models/ticket.model');
exports.createTicket = async (req, res) => {
    //validate title
    if (!req.body.title) {
        return res.status(400).send({
            message: "title not found"
        });
    }
    if (!req.body.description) {
        return res.status(400).send({
            message: "description not found"
        });
    }

    //res of works
    const ticketObject = {
        title: req.body.title,
        reporter: req.userId,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        status: 'PENDING'
    }
    let engineer;
    try {
        engineer = await user.findOne({
            userType: isValied.userType.engineer,
            userStatus: isValied.userStatus.approved
        });
        if(engineer){
            ticketObject.assignee = engineer.userId
        }else{
                ticketObject.assignee = "Not Avaliable!"
            }
        }catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal error!"
        });
    }
    if (engineer) {
        ticketObject.status = 'OPEN'
    } else {
        ticketObject.status = "PENDING";
    }
    try {
        const ticketDetails = await TicketModel.create(ticketObject)
        console.log(req.userId)
        if (ticketDetails) {
            const customer = await user.findOne({
                userId: req.userId
            });

            if (customer.ticketsCreated) {
                customer.ticketsCreated.push(ticketDetails._id);
                await customer.save()
            } else {
                customer.ticketsCreated = [ticketDetails._id];
                customer.ticketsAssigned.push(engineer._id);
                await customer.save()
            }
           if(engineer){
            if (engineer.ticketsAssigned) {
                engineer.ticketsAssigned.push(ticketDetails._id);
                engineer.ticketsCreated.push(customer._id);
                await engineer.save()
            } else {
                engineer.ticketsAssigned = [ticketDetails._id];
                await engineer.save()
            }
           }
            return res.status(201).send({
                message: "Ticket creating Successfully!",
                success: true,
                TicketSummry: ticketDetails
            });
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: " error in Ticket creating",
            success: false
        })
    }
}

exports.findAllTickets = async (req, res) => {
    let find = {}
    let data = {};
    const status = req.query.status
    if (status) {
        if (isValied.TicketStatus[status]) {
            find.status = isValied.TicketStatus[status]
        }else{
            return res.status(400).send({
                message:"invalied status ! status as [open,closed,inprogress,block]",
                success:false,
            })
        }
    }
    try {
        data = await user.findOne({
            userId: req.userId
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: "something want wrong!",
            success: false
        });
        return;
    }
    if (data.userType == 'engineer') {
        find.assignee = data.userId
    }
    if (data.userType == 'CUSTOMER') {
        find.reporter = data.userId
    }
    try {
        const ticketDetails = await TicketModel.find(find);
        if (ticketDetails) {
            res.status(201).send({
                message: "fatch all tickets successfully!",
                success: true,
                TicketSummry: ticketDetails
            });
            return;
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: "something want wrong!",
            success: false
        });
        return;
    }
}

exports.deleteTicket = async (req, res) => {
    let find = {}
    let data = {};
   if(req.body.id){
    find._id  = req.body.id
   }
    try {
        data = await user.findOne({
            userId: req.userId
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: "something want wrong!",
            success: false
        });
        return;
    }
    if (data.userType == isValied.userStatus.engineer) {
       return  res.status(500).send({
            message: "Engineer could not Delete any Ticket!",
            success: false
        });
        
    }
    if (data.userType == 'CUSTOMER') {
        find.reporter = data.userId
    }
    try {
        const deleted = await TicketModel.deleteOne(find).exec();
        console.log(deleted)
        if (deleted) {
            res.status(201).send({
                message: "Ticket Deleted Successfully!",
                success: true,
                deleteSummry: deleted
            })
            return;
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: "something want wrong!",
            success: false
        });
        return;
    }
}

exports.getOneTicketbyId = async (req, res) => {
    let data;
    if (req.userId) {
        try {
            data = await user.findOne({
                userId: req.userId
            });
        } catch (err) {
            return res.status(500).send({
                message: "Invalied user!",
                success: false
            })
        }
    }
    if (data.userType !== isValied.userType.engineer) {
        return res.status(500).send({
            message: "Invalied user!",
            success: false
        })
    }
    if (req.params.id) {
        try {
            const ticketData = await TicketModel.findOne({
                _id: req.params.id
            });
            return res.status(200).send({
                message: "Data fetch successfully!",
                success: true,
                ticketDetails: objConverter.OneTicketObject(ticketData)
            })
        } catch (err) {
            return res.status(500).send({
                message: "Something Want Wrong!",
                success: false
            })
        }
    } else {
        return res.status(401).send({
            message: "Please pass the ticket ID as a Parametar!",
            success: false
        })
    }

}

//---------------------update - status->(update every one) ,( title , description)-->only update by reporte
exports.updateTicket = async (req, res) => {
    //update status
    const status = req.query.status;
    const ticketId = req.body.id;
    const updateingData = {};
    const find = {}
    let ticket;
    if(ticketId){
                    try{
                         ticket = await TicketModel.findOne({_id:ticketId});
                        
                    }catch(err){
                        return res.status(400).send({
                            message:"Invalied ticket ID",
                            success:false,
                        })
                    }
                    let userData
                    try{
                         userData = await user.findOne({userId:req.userId});
                    }catch(err){
                        return res.status(401).send({
                            message:"Invalied User or You are not Authorized",
                            success:false,
                        })
                    }
                    if(userData.userType==isValied.userType.engineer){
                        find._id = ticketId;
                        find.assignee = req.userId;
                    }
                     if(userData.userType==isValied.userType.customer){
                        find._id = ticketId;
                        find.reporter = req.userId;
                    }
                       
    }else{
        return res.status(400).send({
            message:"Please Provide the ticket ID",
            success:false,
        })
    }
    if (status) {
        if(ticket.status===isValied.TicketStatus.closed){
            return res.status(401).send({
                message:`Ticket is ${isValied.TicketStatus.closed} . So not need Update further!`,
            })
         }
        if (isValied.TicketStatus[status]) {
            updateingData.status = isValied.TicketStatus[status]
        }else{
            return res.status(400).send({
                message:"invalied status ! status as [open,closed,inprogress,block]",
                success:false,
            })
        }
    }
    if(req.body.title){
        if( find.reporter==req.userId){
        updateingData.title = req.body.title
        }else{
            return res.status(401).send({
                message:"Only Ticket creator Update the More info!",
                success:false
            })
        }
    }
    if(req.body.description){
        if(find.reporter==req.userId){
           updateingData.description = req.body.description
        }else{
            return res.status(401).send({
                message:"Only Ticket creator Update the More info!",
                success:false
            })
        }
    }
    try{
        const updated = await TicketModel.findOneAndUpdate(find,updateingData)
        return res.status(201).send({
            message:"Update successfully!",
            success:true,
            BeforeUpdateing : updated
        })
    }catch(err){
        return res.status(400).send({
            message:"Something want wrong!",
            success:false,
        })
    }
}