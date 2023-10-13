import jwt from 'jsonwebtoken';

async function verifyJwt(authHeader) {

  let user;

  try{

    if(!authHeader) {
      user = "GUEST";
      return user;
    }else {
      
      const secretKey = process.env.SECRET;
      const authToken = authHeader.replace("Bearer ", "");
      
      user = jwt.verify(authToken, secretKey)
      return user;
    };
  }catch(err) {
    return console.log(err)
  };
}

export default { verifyJwt };