
// в системе будут использоваться следующие таблицы:
//
// t_cashmachine - справочник ССМ, отдающих №№ купюр
// t_deposits    - реестр загруженных депозитов ("партий" пересчитанных банкнот)
// t_TranspFile  - реестр загруженных транспортных файлов с информацией о пересчитанных банкнотах
// t_BnkNumList  - реестр пересчитанных банкнот
// event_log     - протокол работы 




const typeorm = require("typeorm"); // import * as typeorm from "typeorm";



const t_CashMachine = require("./entity/t_cashmachine_schema").t_CashMachine;
const m_CashMachine = require("./model/t_cashmachine_model").CashMachine; // 

const t_Deposits = require("./entity/t_deposits_schema").t_Deposits;
// const m_Deposits = require("./model/t_deposits_model").Deposits; // 

const t_TranspFile = require("./entity/t_transpfile_schema").t_TranspFile;
// const m_TranspFile = require("./model/t_transpfile_model").TranspFile; // 

const t_BnkNumList = require("./entity/t_bnknumlist_schema").t_BnkNumList;
// const m_BnkNumList = require("./model/t_bnknumlist_model").BnkNumList; // 



module.exports.db_parameters = {
    type: "mssql",
    host: "localhost",
    port: 1433,
    username: 'user_bps',
    password: ``,
    database: 'BanknoteList',
    synchronize: true,
    logging: false,
    entities: [
        require("./entity/t_cashmachine_schema"),
        require("./entity/t_deposits_schema"),
        require("./entity/t_transpfile_schema"),
        require("./entity/t_bnknumlist_schema")


    ]
};


//try{
//    
//    module.exports.db_connection = (async function() {
//        //const AppDataSource = new DataSource(module.exports.db_parameters);
//        //AppDataSource.initialize()
//        typeorm.createConnection(module.exports.db_parameters)
//        .then((connection) => {
//            console.log("Data Source has been initialized!");
//            return /* AppDataSource */ connection;
//        })
//        .catch((err) => {
//            console.error("Error during Data Source initialization", err);
//        })
//
//
//        //await typeorm.createConnection(module.exports.db_parameters);
//    })();
//    
//    console.log(module.exports.db_connection);
//    
//}
//catch(err){
//    console.log(err);
//
//}

