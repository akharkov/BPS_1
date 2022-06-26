

const fs = require('fs');
const path = require('path');

//const fileMatch = require('file-match');

const db_settings = require('./dbsettings');
const db = require("./db_module.js");

const { constants } = require('perf_hooks');


const fDescript = require('./descriptors.js');
module.exports.fDescript = fDescript;


// let fPars = require('./filetransportreader.js');
let fPars = require('./readtranspfile.js');


//const { now } = require('mongoose');

//let pathIN = `J:/laurel/cur_bps/` ;
//let pathOut = `J:/laurel/cur_bps/Ok/`;/

let pathIN = './in/';
let pathOut = './in/Ok/';

const fileMask = '*_SnListReport_Closed.dat';

const config = {
    scanFiles : true,
    scanFilesBreak: false,
    dbPool:{},
    pathIN : path.resolve(pathIN), // path to your directory goes here
    pathOut : path.resolve(pathOut)

}

module.exports.config=config;





//console.log(`fDescript.descriptDeposit = ${fDescript.descriptBpsFile.descriptDeposit.structureData[2]}`);
//console.log(`fDescript.descriptBN = ${fDescript.descriptBpsFile.descriptBN.structureData[3]}`);
//console.log(fDescript);



process.stdout.write('\033c');
 console.log(`${ new Date().toLocaleString()} : connect to sql database`);

 db.dbConnect()
 .then (pool=>{
     if(pool===null) {
         console.log(`Ошибка открытия базы данных для `,db_settings);
         
         return;
     } else{
        console.log(`${ new Date().toLocaleString()} : База данных открыта для `,db_settings);
        config.dbPool = pool;
    // после установки соединения с БД можем продолжить работу сервера

    //console.log(`Вроде как подключились ${pool}`);

    db.dbLogAdd(config.dbPool,`dbOpen`,`server.dbConnect`,`server=${db_settings.server} database=${db_settings.database} user=${db_settings.user}`,`convert(datetime,'${new Date().toISOString()}')`); //${JSON.stringify(db_settings)}


    //    fPars.scanFileForParser(config.pathIN, fileMask, config.pathOut, config.dbPool)
    fPars.scanFileForParser(config.pathIN, fileMask, config.pathOut, config.dbPool)



     }    
     
 });
  


 