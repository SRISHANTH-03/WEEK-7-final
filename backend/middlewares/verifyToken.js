import jwt from 'jsonwebtoken'
const {verify} =jwt

export const verifyToken=(...allowedRoles)=>{
    return (req,res,next)=>{
        try{
            // token verification logic
            const token=req.cookies?.token
            // if req from unauthoried user
            if(!token){
                return res.status(401).json({message:"Please Login"})
            }
            const decodedToken =verify(token,process.env.SECRET_KEY)
             if(!allowedRoles.includes(decodedToken.role)){
                return res.status(403).json({message:"Your are not authorized"})
             }
            // check the role is same as role in decodedToken
            console.log(decodedToken)
            req.user=decodedToken
            next()
        }catch(err){
            res.status(401).json({message:"session expired"})
        }
}
}