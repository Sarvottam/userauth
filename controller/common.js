const protected = async (req, res,next) => {
    try {
        next();
      
    }
    catch (e) {
        console.error("EEEEE ", e)
        return _handleResponse(req, res, e)
    }
};



module.exports = {
    protected: protected,
}