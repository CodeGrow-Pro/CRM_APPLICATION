exports.OneUserConverter = (userObj)=>{
    const user = {
        userID : userObj.userId,
        username : userObj.name,
        userEmail : userObj.email,
        userType:userObj.userType,
        userStatus : userObj.userStatus,
        updatedAt:userObj.updatedAt
    };
return user;
}
exports.multiConverter = (user)=>{
    const send = [];
    user.forEach(u => {
        send.push({
            name: u.name,
                userId:u.userId,
                email: u.email,
                userType: u.userType,
                userStatus: u.userStatus,
                ticketsCreated:u.ticketsCreated,
                ticketsAssigned:u.ticketsAssigned
        })
    });
    return send;
}