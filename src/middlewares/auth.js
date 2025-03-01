const adminAuth = (req, res,next) => {
    console.log("Checked admin authorization");
    const token  = "xyz";
    const isAdminAuthorized = token === "xyzcxc";
    if (!isAdminAuthorized) {
        res.status(401).send("unAuthorized request");
    }else{
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("Checked user authorization");
    const token  = "abce";
    const isUserAuthorized = token === "abce";
    if(!isUserAuthorized){
        res.status(401).send("unauthorized request");
    }else{
        next();
    }
}

module.exports = {
    adminAuth: adminAuth,
    userAuth: userAuth,
 };
