

const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
const CashMachine = require("../model/t_cashmachine_model" ).CashMachine; // import {t_CashMachine} from "../model/*t_CashMachine*";





/* module.exports */ 
module.exports.t_CashMachine = new EntitySchema({
    name: "t_CashMachine",
    /* target: t_CashMachine,  */ 
    columns: {
        id_CashMachine: {
            primary: true,   //???
            generated: false,
            type: "nvarchar",            
            length: 100

        },
        MachineSN: {
            type: "nvarchar",            
            length: 50
        },
        MMachineID: {
            type: "nvarchar",            
            length: 50
        },
        MachineType: {
            type: "nvarchar",            
            length: 100
        },
        OfficeID: {
            type: "nvarchar",            
            length: 20
        },
        rec_Created: {
            type: "datetime"            
           
        }

        
    }
});



