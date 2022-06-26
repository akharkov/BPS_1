// https://tediousjs.github.io/node-mssql/

const sql = require('mssql');


const sqlConfig = {
    user: 'OVP',
    password: 'Qwer1234',
    server:  's24-webdro', //.regions.alfaintra.net
    database: 'WEBEXBOT',
    options: {
    encrypt: false,
    useUTC: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000/* ,
        trustServerCertificate: true */
    }
}

async function dbOpen()  {
 try {
     console.log(`1`)
     console.log(`==`)

  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  console.log(`2`)
  console.log(`==`)

  const result = await sql.query(`SELECT        TOP (200) OPERATORS, ACCOUNT_NAME, full_name, CONTACT_NAME, EMAIL, NAME
  FROM            sm_groups`)
  console.dir(result)
 } catch (err) {
  // ... error checks
  console.log(`3`)
  console.log(`==`)


  console.log(`Errorocka `, err);
 }
}



dbOpen();





