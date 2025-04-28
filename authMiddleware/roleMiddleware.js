const authorizeRoles = (roles) => {
    return (req, res, next) => {
   try {
   if(!roles.includes(req.user.role)){
    return res.status(403).json({message: "Unauthorized Access! , You are not authorized to access this resources "});
   } 
   next();
   } catch (error) {
    console.log(error);
   }
    };
  };
  
  module.exports = { authorizeRoles };
  