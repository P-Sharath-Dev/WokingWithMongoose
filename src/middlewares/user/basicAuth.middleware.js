import UserModel from "../../features/user/user.model.js";

const basicAuth = (req, res, next)=>{

    //1. check for authorization
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(400).send("auth is missing");
    }
    //console.log(authHeader);

    // 2. getting data from authHeader

    const base64Creds = authHeader.replace('Basic ', '');
    //console.log(base64Creds);

    const decodedCreds = Buffer.from(base64Creds, 'base64').toString(); //decoding the data inside base65Creds
                                                                        // using base64 and converting it to
                                                                        // string
    console.log(decodedCreds); //seller@gmail.com:12345

    const [email, password] = decodedCreds.split(":");
    //console.log(email, password);

    // 3. checking if user exists
    const users = UserModel.getAllUsers();
    const user = users.find(user => user.email == email && user.password == password);
    if (user) {
        next();
    } else {
        return res.status(401).send("unauthorized"); 
    }
}

export default basicAuth;