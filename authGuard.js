


let authGuard = async function  (req,res,next) {
    let user = JSON.parse(process.env.USER_ADMIN)
   if (req.session.connected) {
    next()
   }else{
    res.redirect('/login')
   } 
} 

export default authGuard