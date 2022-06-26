"use strict";




const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs');
const path = require('path');
// const request2 = require('request');
const serverApp = express();
//const { CustomRepositoryCannotInheritRepositoryError, Repository } = require("typeorm");
const typeorm = require("typeorm"); // import * as typeorm from "typeorm";


serverApp.use(bodyParser.json());
serverApp.use(bodyParser.urlencoded({ extended: true }));

// const tmp_routers = require("./tmp_routes.js");
// const mng_schemas = require("./mongoschemas.js");




//================================ Разрешение CORS ============================================
serverApp.use(function (req, res, next) {
    const origins = [
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:5000'
    ];
    for(let i = 0; i < origins.length; i++){
        const origin = origins[i];
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({
    extended: false,
})








const db = require("./db.js");






const portListen = 3000;



/* 
 (async function(){
    const AppDataSource = new typeorm.DataSource({
        type: "mssql",
        host: "localhost",
        port: 1433,
        username: 'user_bps',
        password: ``,
        database: 'BanknoteList',
        synchronize: true,
        logging: false,
        entities: [
            require("./entity/t_cashmachine_schema.js")
            //require("./entity/ CashMachineSchema")
            //__dirname + "/entity/*.js"
        ]
    });
    const ddd = await AppDataSource.manager.find(t_CashMachine);
    ddd = await AppDataSource.manager.find(t_CashMachine);

})(); */

/* 
const AppDataSource = new typeorm.DataSource({
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: 'user_bps',
    password: ``,
    database: 'BanknoteList',
    synchronize: true,
    logging: false,
    entities: [
        require("./entity/t_cashmachine_schema.js")
        //require("./entity/ CashMachineSchema")
        //__dirname + "/entity/*.js"
    ]
}); 

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        const ddd = await AppDataSource.manager.find(t_CashMachine);
        ddd = await AppDataSource.manager.find(t_CashMachine);
        console.log("Data Source has been initialized!eee");


    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
 */










    typeorm.createConnection(db.db_parameters).then(async function (connection) {

    

        
        // const ddd = await connection.manager.find(t_CashMachine);  // вылазит No metadata for "t_CashMachine" was found.
        /* 
            const CashMachineRepository = connection
            .getRepository(t_CashMachine)     
            .createQueryBuilder("t_CashMachine")  // вылазит No metadata for "t_CashMachine" was found.
            .select("*")
            .from('t_CashMachine')
            .execute()
            .then((rrr)=>{
                console.log(rrr);
                return rrr;
            });  
            */




        // routes





        if (process.env.NODE_ENV === 'production') {
            serverApp.use('/', express.static(path.join(__dirname, 'client', 'build')))
            
        
            serverApp.get('*', (req, res) => {
             res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
                
            })
        }
        
        
        
        
        serverApp.get('/', function (request, response) {
            response.sendFile( path.resolve(__dirname, '../client', 'public', 'index.html') /* 'index.html' */)
        });





        serverApp.get("/", async function(request, response){
            
            const res =  await  connection
            .createQueryBuilder(/* "t_CashMachine" */)
            .select("*")
            .from('t_CashMachine')
            .execute()
            .then((rrr)=>{
                console.log(rrr);
                return response.json(rrr)
            }); 

        });

        // начинаем прослушивать подключения на portListen
        serverApp.listen(portListen);

    }).catch(function(error) {
        console.log("Error: ", error);
    });
 
