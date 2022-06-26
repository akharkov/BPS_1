const settings = require('./dbsettings');
const sql = require('mssql');
let pool;

//console.log('settings', settings);


exports.dbConnect = async function() {
  console.log('Create Pool');
  var conn = await new  sql.ConnectionPool(settings);
  return pool = conn.connect()

  .then(function(){ return conn; })
  .catch(function(err){
          pool = null;
          console.log(`Errorochka from catch`);
          console.log(err);
          return pool ; //Promise.reject(err);
  });
};



exports.execSql = async function (sqlquery) {
  console.log('Create Pool');
  const pool = new sql.ConnectionPool(settings);
  
  pool.on('error', err => {
    // ... error handler 
    console.log('sql errors', err);
  });

  try {
    console.log('Connect...',sqlquery);

    await pool.connect();
    let result = await pool.request().query(sqlquery);
    
    debugger;
    console.log(`result ==`);
    console.log(result);

    return { success: result.recordsets[0] };
  } catch (err) {
    console.error(err);
    return { err: err };
  } finally {
    //console.log('CLOSE')
    //pool.close(); //closing connection after request is finished.
  }
};












