"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "Users",
      } );
    }
  }
  Comment.init(
    {
      content: DataTypes.STRING,
      blogId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      // references: {
      //     model: 'Users', // Name of the target model
      //     key: 'id', // Key in the target model
      // },
      // allowNull: false
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
