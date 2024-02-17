//midalware iska kam hai tokan ko dicript karna
var jwt = require('jsonwebtoken');
const JWT_Secret= 'Harryisgoodb$oy';

const fetchuser=(req,res,next)=>{
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token'); //token ko bhejege
    if(!token){
        res.status(401).send({error:"please authenticate using a valid token"}) //agar token sahi nahi hoga tho
    }
    try {
        const data =jwt.verify(token,JWT_Secret); // token ko verify karenge aur incript bhi
        req.user= data.user; //dale huye tokan ka user milegaga i.e decription data , phir usse req.user ke barobar kar denge aur auth.js ke rote no.3 me (id) use karege, get user from JWT token

        next(); //verfy ho jata hai tho auth.js ka route no.3 chalega
        
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})
    }

}

module.exports= fetchuser;