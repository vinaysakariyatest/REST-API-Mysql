"use strict";

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.STRING
    },
      blogId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Blogs", // Name of the target model
          key: "id", // Key in the target model
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Name of the target model
            key: 'id', // Key in the target model
        },
        allowNull: false,
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
