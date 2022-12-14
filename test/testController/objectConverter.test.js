const converter = require('../../objectConverter/userObjectConverter')
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

describe('oneObjectConverter test',()=>{
    it('one object  converter pass',()=>{
        converter.OneUserConverter(customerTestPayload);
        expect.objectContaining({
            userID : customerTestPayload.userId,
            username : customerTestPayload.name,
            userEmail : customerTestPayload.email,
            userType:customerTestPayload.userType,
            userStatus : customerTestPayload.userStatus,
        })
    })
})
describe('MultiObject converter test',()=>{
    it('Multi object  converter pass',()=>{
        converter.multiConverter([customerTestPayload]);
        expect.objectContaining({
            userID : customerTestPayload.userId,
            username : customerTestPayload.name,
            userEmail : customerTestPayload.email,
            userType:customerTestPayload.userType,
            userStatus : customerTestPayload.userStatus,
        })
    })
})