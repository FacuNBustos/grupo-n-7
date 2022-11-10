const createHttpError = require('http-errors');
const { user } = require('../../database/models');
const { endpointResponse } = require('../../helpers/success');
const { catchAsync } = require('../../helpers/catchAsync');

module.exports = {
  getAllUsers: catchAsync(async (req, res, next) => {
    try {
      const actualPage = Number(req.query.page);
      const total = await user.count();
      let from = 0;
      let to = 10;
      if (!actualPage || actualPage === 0 ) {
        to = total;
      };
      if (actualPage > 1 ) {
        from = (actualPage-1)*to;
      };
      let response = await user.findAll({
        offset: from,
        limit: to,
        attributes: ['firstName', 'lastName', 'email', 'createdAt']
      });
      if(actualPage && actualPage > 1 && total > from){
        response.push({
          prevPage: `http://localhost:3000/users${req.url.replace(`page=${actualPage}`, `page=${Number(actualPage)-1}`)}`,
        })
      };
      if(actualPage && actualPage >= 1 &&  (total-to) > from){
        response.push({
          nextPage: `http://localhost:3000/users${req.url.replace(`page=${actualPage}`, `page=${Number(actualPage)+1}`)}`,
        })
      };
      endpointResponse({
        res,
        message: 'Users search successfully',
        body: response,
      });
    } catch (error) {
      const httpError = createHttpError(
        error.statusCode,
        `[Error getting all users] - [user - GET]: ${error.message}`
      );
      next(httpError);
    }
  }),
};


