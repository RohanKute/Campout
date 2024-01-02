class ValError extends Error{
    constructor(messege , statusCode){
        super();
        this.statusCode = statusCode;
        this.messege = messege;
    }
}

module.exports = ValError;