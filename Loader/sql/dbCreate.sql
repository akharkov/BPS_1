
/* 

https://app.dbdesigner.net/designer/schema/511912


 */

use BanknoteList

CREATE TABLE [t_CashMachine] (
	id_CashMachine nvarchar(100) NOT NULL,
	MachineSN nvarchar(50) NOT NULL,
	MachineID nvarchar(50) NOT NULL,
	MachineType nvarchar(100) NOT NULL,
	OfficeID nvarchar(20) NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_T_CASHMACHINE] PRIMARY KEY CLUSTERED
  (
  [id_CashMachine] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO
CREATE TABLE [t_Deposits] (
	id_Deposit nvarchar(100) NOT NULL DEFAULT newid(),
	rel_id_CashMachine nvarchar(100) NOT NULL,
	rel_id_FileName nvarchar(200) NOT NULL,
	DepositStatus nvarchar(50) NOT NULL,
	DepositStartDateTime datetime NOT NULL,
	DepositEndDateTime datetime NOT NULL,
	SegmentFlag nvarchar(10) NOT NULL,
	PayoutCount nvarchar(10) NOT NULL,
	DeclaredAmount nvarchar(10) NOT NULL,
	CustomerID nvarchar(10) NOT NULL,
	DepositID nvarchar(20) NOT NULL,
	Currency nvarchar(10) NOT NULL,
	OpModeName nvarchar(100) NOT NULL,
	OperatorID nvarchar(10) NOT NULL,
	SNImageAvailability nvarchar(10) NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_T_DEPOSITS] PRIMARY KEY CLUSTERED
  (
  [id_Deposit] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO
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
GO
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
GO
CREATE TABLE [event_log] (
	id_log uniqueidentifier NOT NULL DEFAULT newid(),
	event_Type nvarchar(100) NOT NULL,
	event_Point nvarchar(500) NOT NULL,
	event_Text nvarchar(1000) NOT NULL,
	event_DT datetime NOT NULL,
	rec_Created datetime NOT NULL DEFAULT getdate(),
  CONSTRAINT [PK_EVENT_LOG] PRIMARY KEY CLUSTERED
  (
  [id_log] ASC
  ) WITH (IGNORE_DUP_KEY = OFF)

)
GO







