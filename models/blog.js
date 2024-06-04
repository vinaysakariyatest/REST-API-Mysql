'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blog.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    image: DataTypes.ARRAY(DataTypes.STRING),
    categoryId: DataTypes.INTEGER,
    bloggerId: DataTypes.INTEGER,
    likes: {
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes: {
      type:DataTypes.INTEGER,
      defaultValue: 0
    },
    likedBy: {
      type: DataTypes.JSON,
      references: {
          model: 'Users', // Name of the target model
          key: 'id', // Key in the target model
      },
  },
  dislikedBy: {
      type: DataTypes.JSON,
      references: {
          model: 'Users', // Name of the target model
          key: 'id', // Key in the target model
      },
  },
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};