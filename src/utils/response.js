class Responses {
    successResponse = (message, data, ...args) => {
        return {
            success: true,
            message: `${message}`,
            data: data,
        };
    };
    failedResponse = (message, err) => {
        return {
            success: false,
            message: `${message}`,
            error: err.message,
            //    error:{reason:`${err.message}`,"errorTime":err.timestamp}
        };
    };
    //    joiResponse = (message,err)=>{
    //        return{
    //            success:false,
    //            message:"failed to retrive data",
    //            error:{reason:`${message}: ${err.details[0].message}`}
    //        }
    //    }
}
module.exports = new Responses();
