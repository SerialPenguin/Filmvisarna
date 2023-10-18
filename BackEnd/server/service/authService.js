import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

async function verifyJwt(authHeader) {

  let user;

  try{

    if(!authHeader) {
      return user;
    }else {
      
      const secretKey = process.env.SECRET;
      const authToken = authHeader.replace("Bearer ", "");
      
      let jwtInfo = jwt.verify(authToken, secretKey)
      user = new mongoose.Types.ObjectId(jwtInfo.id);
      return user;
    };
  }catch(err) {
    return console.log(err)
  };
}

export default { verifyJwt };