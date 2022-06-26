
const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
//const CashMachine = require("../model/t_cashmachine_model" ).CashMachine; // import {t_CashMachine} from "../model/*t_CashMachine*";



module.exports.t_BnkNumList = new EntitySchema({
    name: "t_BnkNumList",
    tableName: "t_BnkNumList",
    /* target: t_TranspFile,  */ 
    columns: {
        id_BnkNumRecord: {
            primary: true,   //???
            generated: true,
            type: "nvarchar",            
            length: 200
        },
        rel_id_Deposit: {
            type: "nvarchar",            
            length: 100
        },
        DenomId: {
            type: "nvarchar",            
            length: 10
        },
        Denom: {
            type: "nvarchar",            
            length: 20
        },
        SNID: {
            type: "nvarchar",            
            length: 30
        },
        SNLength: {
            type: "integer"
        },
        dtStart: {
            type: "datetime"
        },
        QualityId: {
            type: "nvarchar",            
            length: 10
        },
        OCID: {
            type: "nvarchar",            
            length: 10
        },        
        BnID: {
            type: "nvarchar",            
            length: 10
        },
        SNImageID1: {
            type: "nvarchar",            
            length: 10
        },        
        SNImageID2: {
            type: "nvarchar",            
            length: 10
        },
        rec_Created: {
            type: "datetime"            
           
        }

        
    }
});



/* 
CREATE TABLE [t_BnkNumList] (
	id_BnkNumRecord uniqueidentifier NOT NULL DEFAULT newid(),
	rel_id_Deposit nvarchar(100) NOT NULL,
	DenomId nvarchar(10) NOT NULL,
	Denom nvarchar(20) NOT NULL,
	SNID nvarchar(30) NOT NULL,
	SNLength int NOT NULL,
	dtStart datetime NOT NULL,
	QualityID nvarchar(10) NOT NULL,
	OCID nvarchar(10) NOT NULL,
	BNId nvarchar(10) NOT NULL,
	SNImageID1 nvarchar(10) NOT NULL,
	SNImageID2 nvarchar(10) NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_T_BNKNUMLIST] PRIMARY KEY CLUSTERED
  (
  [id_BnkNumRecord] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)

 */