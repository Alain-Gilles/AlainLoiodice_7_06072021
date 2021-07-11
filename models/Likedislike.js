//
// like = 0 si le user n'a pas liké le message
// like = 1 si le user a liké le message
// dislike = 0 si le user n'a pas disliké le message
// dislike = 1 si le user a disliké le message
//
// unavis contient 0 s'il n'y a pas de like ou de dislike pour ce message pour cet utilisateur
// unavis contient 1 s'il y a un avis

module.exports = (sequelize, DataTypes) => {
  const Likedislike = sequelize.define("likedislike", {
    liked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    disliked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unavis: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Likedislike;
};
