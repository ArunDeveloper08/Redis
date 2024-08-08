import { client } from "../app.js";


export const rateLimiter=(limit,timer)=>async(req,res,next)=>{
    
   
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;   
    const requestCount = await client.incr(`${clientIp}:request_count`)
    console.log(requestCount)
    if(requestCount === 1){
     await   client.expire(`${clientIp}:request_count`,timer)
    }
    const ttl = await client.ttl(`${clientIp}:request_count`)
   if(requestCount > limit){
    return res.status(429).json
    ({message:`Too many requests from this IP address , please try again after 
      ${ttl} seconds`})
   }
   next();
}