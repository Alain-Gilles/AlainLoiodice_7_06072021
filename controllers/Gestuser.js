const db = require("../models");
const User = db.users;

exports.deleteUser = async (req, res, next) => {
  //
  // Seul le profil connecté peut supprimer son profil
  //
  // Exception si le profil connecté est Admin alors il peut supprimer
  // n'importe quel profil. Pour ce faire une entree supplémentaire est necessaire "userToDelete"
  //
  // Id utilisateur est obligatoire
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "user can not be empty!",
    });
    return;
  }
  //
  // L'utilisateur doit exister sinon erreur
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
    });
    return;
  }
  if (user.isAdmin) {
    //
    // l'utilisateur à supprimer doit être fourni
    //
    if (!req.body.userToDelete) {
      res.status(400).send({
        message: "userToDelete is empty!",
      });
      return;
    }
    //
    // userToDelete doit exister dans BD users
    //
    let user = await User.findByPk(req.body.userToDelete);
    if (!user) {
      res.status(400).send({
        message: "Does Not exist a User with id = " + req.body.userToDelete,
      });
      return;
    }
    //
    // suppression du user
    //
    await user.destroy({ where: { id: req.body.userToDelete } });
    res.status(200).send({
      message: "Delete Successfully a User with id = " + req.body.userId,
    });
  } else {
    //
    // Seul le du profil ou l'Administrateur à le droit de supprimer le profil
    //
    if (!(user.id == req.body.userId)) {
      res.status(400).send({
        message:
          "Only user who create the profil can delete it, connect user = " +
          req.body.userId +
          " user who create message : " +
          user.id,
      });
      return;
    }
    //
    // suppression du user
    //
    await user.destroy({ where: { id: req.body.userId } });
    res.status(200).send({
      message: "Delete Successfully a User with id = " + req.body.userId,
    });
  }
};
