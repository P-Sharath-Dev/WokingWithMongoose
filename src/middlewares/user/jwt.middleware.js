import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  //get token from request
  //console.log("req.headers", req.headers);
  const token = req.headers.authorization;
  //console.log("token", token);

  if (!token) {
    return res.status(400).send("unathorized");
  }

  //verify token
  try {
    const validToken = jwt.verify(token, process.env.SECRET_KEY);
    console.log("TOKEN RECEIVED:", token);
    console.log("DECODED TOKEN:", validToken);
    //console.log("isValidToken", validToken);
    req.userId = validToken.id;
  } catch (err) {
    //err
    return res.status(401).send("invalid token");
  }
  next();
};

export default jwtAuth;
