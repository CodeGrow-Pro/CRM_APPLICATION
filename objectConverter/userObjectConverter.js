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