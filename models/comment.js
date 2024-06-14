"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "users",
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
      tableName: "comments",
      freezeTableName: true
    }
  );
  return Comment;
};
