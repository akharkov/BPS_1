const typeorm = require("typeorm"); // import * as typeorm from "typeorm";


//const Post = require("./model/t_cashmachine_model").CashMachine; // import {CashMachine} from "./model/*CashMachine*";

const  CashMachine = require("./model/t_cashmachine_model").CashMachine; // import { CashMachine} from "./model/ CashMachine";
const db = require(`./db.js`);

console.log(db.db_connection);


const ttt = (async function(){  
    await db.db_connection.getRepository(t_CashMachine).createQueryBuilder("t_CashMachine");
    console.log(ttt);})()




