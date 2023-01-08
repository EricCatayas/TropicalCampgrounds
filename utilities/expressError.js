class ExpressError extends Error{
    constructor(message, status){
        super();                      // <-- calls Error constructor
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;