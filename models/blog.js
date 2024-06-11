'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      models.Blog.belongsTo(models.category,
        { foreignKey: 'categoryId', as: 'categories' }
      )

      models.Blog.belongsTo(models.blogger,
        { foreignKey: 'bloggerId', as: 'Author' }
      )
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