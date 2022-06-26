

const EntitySchema = require("typeorm").EntitySchema; // import {EntitySchema} from "typeorm";
//const Category = require("../model/t_deposits_model" ).t_Deposits; // import {t_Deposits} from "../model/*t_Deposits*";





module.exports.t_Deposits = new EntitySchema({
    name: "t_Deposits",
    /* target: t_Deposits, */
    columns: {
        id_Deposit: {
            primary: true,   
            generated: true,
            type: "nvarchar",            
            length: 100

        },
        rel_id_CashMachine: {
            type: "nvarchar",            
            length: 100
        },
        rel_id_FileName: {
            type: "nvarchar",            
            length: 200
        },
        DepositStatus: {
            type: "nvarchar",            
            length: 50
        },
        DepositStartDateTime: {
            type: "datetime"          
        },
		DepositEndDateTime: {
            type: "datetime"            
        },
		SegmentFlag: {
            type: "nvarchar",            
            length: 10
        },
		PayoutCount: {
            type: "nvarchar",            
            length: 10
        },
		DeclaredAmount: {
            type: "nvarchar",            
            length: 10
        },
		CustomerID: {
            type: "nvarchar",            
            length: 10
        },
		DepositID: {
            type: "nvarchar",            
            length: 10
        },
		Currency: {
            type: "nvarchar",            
            length: 10
        },
		OpModeName: {
            type: "nvarchar",            
            length: 100
        },
		OperatorID: {
            type: "nvarchar",            
            length: 10
        },
		SNImageAvailability: {
            type: "nvarchar",            
            length: 10
        },
        rec_Created: {
            type: "datetime"            
           
        }

        
    }
});









/* 
CREATE TABLE [t_Deposits] (
	// id_Deposit nvarchar(100) NOT NULL DEFAULT newid(),
	// rel_id_CashMachine nvarchar(100) NOT NULL,
	// rel_id_FileName nvarchar(200) NOT NULL,
	//DepositStatus nvarchar(50) NOT NULL,
	//DepositStartDateTime datetime NOT NULL,
	//DepositEndDateTime datetime NOT NULL,
	//SegmentFlag nvarchar(10) NOT NULL,
	//PayoutCount nvarchar(10) NOT NULL,
	//DeclaredAmount nvarchar(10) NOT NULL,
	//CustomerID nvarchar(10) NOT NULL,
	//DepositID nvarchar(20) NOT NULL,
	//Currency nvarchar(10) NOT NULL,
	//OpModeName nvarchar(100) NOT NULL,
	//OperatorID nvarchar(10) NOT NULL,
	//SNImageAvailability nvarchar(10) NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_T_DEPOSITS] PRIMARY KEY CLUSTERED
  (
  [id_Deposit] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO

 */