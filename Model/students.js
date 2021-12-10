import db from "../Config/dbConenction.js";
import DataTypes  from 'sequelize';


const stud = db.define('students', {
    Name:{
        type:DataTypes.CHAR
    },
    Age:{  type:DataTypes.INTEGER},
    Mark1:{  type:DataTypes.INTEGER},
    Mark2:{  type:DataTypes.INTEGER},
    Mark3:{  type:DataTypes.INTEGER},
    resultStatus:{type: DataTypes.CHAR},
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    timestamps: false,
  })
  

  export default stud;
