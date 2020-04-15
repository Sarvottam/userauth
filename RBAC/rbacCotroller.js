// Add this to the top of the file
const { roles } = require('./roles')
 
module.exports = {
    grantAccess : function(action, resource) {
        return async (req, res, next) => {
         try {
         
          const permission = roles.can(req.user.role)[action](resource);
          if (!permission.granted) {
              console.log("permission not granted ");
              return _handleResponse(req, res, "Permission Denied, User not authorised to perform this operation")
          }
          next()
         } catch (error) {
          next(error)
         }
        }
       },
        
       allowIfLoggedin : async (req, res, next) => {
        try {
         const user = res.locals.loggedInUser;
         console.log("SARVO allowIfLoggedin ",user)
         if (!user)
          return res.status(401).json({
           error: "You need to be logged in to access this route"
          });
          req.user = user;
          next();
         } catch (error) {
          next(error);
         }
       }
}
