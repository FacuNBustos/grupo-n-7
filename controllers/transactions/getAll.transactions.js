const createHttpError = require('http-errors')
const { transaction ,user,category } = require("../../database/models");
const { endpointResponse } = require('../../helpers/success');
const { catchAsync } = require('../../helpers/catchAsync');
const { ErrorObject } = require('../../helpers/error');


// example of a controller. First call the service, then build the controller method
module.exports = {
  get: catchAsync( async (req,res,next)=>{
    try {
      const response = await transaction.findAll({
        attributes:['id','description','amount','date'],
        include:[
          {
            attributes:['firstName','lastName','email'],
            model:user,
          },
          {
            attributes:['name'],
            model:category,
          }
        ]
      });

      if(!response){
        throw new ErrorObject("Transactions could be not found",404);
      }

      endpointResponse({
        res,
        message: 'transactions retrieved successfully',
        body: response,
      })
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error retrieving index] - [index - GET]: ${error.message}`,
      )
      next(error);
    }
  })
}