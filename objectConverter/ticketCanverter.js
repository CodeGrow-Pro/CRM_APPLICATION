exports.OneTicketObject = (ticket)=>{
      return {
        id:ticket._id,
        title:ticket.title,
        description:ticket.description,
        status:ticket.status,
        reporter:ticket.reporter,
        assignee:ticket.assignee
      }
}