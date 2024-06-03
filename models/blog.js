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
    likes: DataTypes.INTEGER,
    dislikes: DataTypes.INTEGER,
    likedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      references: {
          model: 'Users', // Name of the target model
          key: 'id', // Key in the target model
      },
  },
  dislikedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
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