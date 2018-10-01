module.exports = function(app) {
  var userFuncs = require('../controllers/usersController');
  
  // users Routes
  app.route('/users')
    .get(userFuncs.get_all_users)
    .post(userFuncs.create_user);


  app.route('/users/:id')
    .get(userFuncs.getUserById)
    .put(userFuncs.update_user)
    .delete(userFuncs.delete_user);
};