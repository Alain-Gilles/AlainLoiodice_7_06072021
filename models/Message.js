module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      required: true,
    },
    objet: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    imgUrl: {
      type: DataTypes.STRING,
    },
    nbLike: {
      type: DataTypes.INTEGER,
    },
    nbUnlike: {
      type: DataTypes.INTEGER,
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  return Message;
};
