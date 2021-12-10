import bodyParser from "body-parser";
import express from "express";
import path from "path";
import Sequelize from "sequelize";
import db from "./Config/dbConenction.js";
import stud from "./Model/students.js";
import fs from "fs";
import multer from "multer";
import csv from "csv-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const fileStorageEngine = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./Uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

db.authenticate()
  .then(() => console.log("Db connected"))
  .catch((err) => {
    console.log(`Error while connecting to Db ${err}`);
  });

stud
  .sync()
  .then(() => {
    console.log("Created tables");
  })
  .catch((err) => console.log(err));

//Post CSV to postgres table
app.post("/upload", upload.single("csv"), async(req, res) => {
  console.log(req.file)
  try{
      if(!req.file){
          res.send({message: "Please select file"})
      }
    let csvStream = fs
    .createReadStream(req.file.path)
    .pipe(csv({}))
    .on("data", function (record) {
      csvStream.pause();
      if (record) {
        let result = "";
        if (record.Mark1 < 40 || record.Mark2 < 40 || record.Mark3 < 40) {
          result = "Failed";
        } else {
          result = "Passed";
        }

         stud.create({
          id: record.id,
          Name: record.Name,
          Age: record.Age,
          Mark1: record.Mark1,
          Mark2: record.Mark2,
          Mark3: record.Mark3,
          resultStatus: result,
        });
        ++record;
      }
      csvStream.resume();
    }).on("end", () => {
      console.log("Job is succesfully completed");
    });
  res.send("Succesfully uploaded student data");
  }
  catch(err){
console.log(err);
  } 
});



//Get result of student by ID
app.get("/students/:id/result", async (req, res) => {
  try {
    const result = await stud.findOne({ where: { id: req.params.id } });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

//
app.get('/student',async(req,res)=>{
try{
   const resultStatus= await stud.findAll({ where: { resultStatus:req.query.resultStatus } })
   res.json(resultStatus);
}
catch(err){
    console.log(err);
}

})

//assign port
const port = process.env.PORT || 2021;
app.listen(port, () => console.log("server run at port " + port));
