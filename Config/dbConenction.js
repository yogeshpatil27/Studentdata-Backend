import Sequelize  from 'sequelize';


const db = new Sequelize('School', 'postgres', 'Yogesh@123', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
  });
  

  export default db;
 //db.authenticate().then(()=>console.log("Db connected")).catch((err)=>{console.log(`Error while connecting to Db ${err}`)})

