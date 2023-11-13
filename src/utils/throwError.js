const env = process.env.NODE_ENV || 'development';

const throwError = (...error) => {
    let productionError, developmentError; 

    error.forEach(error =>{
        if(error.mode?.toLowerCase() === 'production') productionError = error;
        if(error.mode?.toLowerCase() === 'development') developmentError = error;
    })

    if(env.toLowerCase() === 'production' && productionError) {
        return productionError
    }
    else if(env.toLowerCase() === 'development' && developmentError) {
        return developmentError
    }
    else {
        return error[0]
    }
}


module.exports = throwError