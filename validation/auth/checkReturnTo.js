function checkReturnTo(req, res, next){
    if(/delete|login|review/.test(req.originalUrl)){
       req.session.returnTo = publicUrl;
    }
    else{
      publicUrl = req.originalUrl;
      req.session.returnTo = req.originalUrl;
    }
    next();
};

module.exports = checkReturnTo;