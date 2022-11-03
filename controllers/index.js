const createHttpError = require('http-errors')
const  { user }  = require('../database/models')
const { endpointResponse } = require('../helpers/success')
const { catchAsync } = require('../helpers/catchAsync')


// const UserModel = models.Test;
// async function  hola  = () => {
// console.log( await Test)
// } 
// example of a controller. First call the service, then build the controller method
module.exports = {
 
  get: catchAsync(async (req, res, next) => {

    try {
      const response = await user.findAll()
      endpointResponse({
        res,
        message: 'Test retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - GET]: ${error.message}`,
      )
      next(httpError)
    }
  }),
}
