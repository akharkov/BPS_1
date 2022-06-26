
const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
// const CashMachine = require("../model/t_cashmachine_model" ).CashMachine; // import {t_CashMachine} from "../model/*t_CashMachine*"




module.exports.t_TranspFile = new EntitySchema({
    name: "t_TranspFile",
    tableName: "t_TranspFile",
    /* target: t_TranspFile,  */ 
    columns: {
        id: {
            primary: true,   //???
            generated: true,
            type: "nvarchar",            
            length: 200

        },
        FileName: {
            type: "nvarchar",            
            length: 250
        },
        dt_Loaded: {
            type: "datetime"
        },
        rec_Created: {
            type: "datetime"            
           
        }

        
    }
});


/* 
CREATE TABLE [t_TranspFile] (
	id nvarchar(200) NOT NULL DEFAULT newid(),
	FileName nvarchar(250) NOT NULL,
	dt_Loaded datetime NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_T_TRANSPFILE] PRIMARY KEY CLUSTERED
  (
  [id] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
 */


