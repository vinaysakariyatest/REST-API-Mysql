'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.ARRAY(DataTypes.ARRAY)
      },
      categoryId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.INTEGER
      },
      dislike: {
        type: Sequelize.INTEGER
      },
      likedBy: {
        type: Sequelize.JSON(DataTypes.JSON)
      },
      dislikedBy: {
        type: Sequelize.JSON(DataTypes.JSON)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};