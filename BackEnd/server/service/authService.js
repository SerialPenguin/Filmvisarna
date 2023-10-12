import jwt from 'jsonwebtoken';

function verifyJwt(authHeader) {
  
  if (!authHeader)
    return res.status(401).json({ msg: "Authorization header is missing" });

  const secretKey = "supersecretkeyforjwt123456789";
  const authToken = authHeader.replace("Bearer ", "");
  
  try{
    const authorized = jwt.verify(authToken, secretKey);
    return authorized;
  }catch(err) {return console.log(err)};
}

export default { verifyJwt };