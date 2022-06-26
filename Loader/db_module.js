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
}



exports.dbLogAdd = async function(pool, eventType, eventPoint, eventText,eventDT){

  let sqlRequest = `insert into BanknoteList.dbo.event_log (event_Type, event_Point, event_Text,event_DT)  values ( '${eventType}', '${eventPoint}', '${eventText.replace(/'/g,"^")}', ${eventDT})`
  pool.request().query(sqlRequest)
  .then (result=>{
      //console.log(`Запись в лог ${sqlRequest}`)
     //console.log(result);
     
  })
  .catch(result=>{
     console.log(`${ new Date().toLocaleString()} : Ошибочка записи в лог ${sqlRequest}`)
     console.log(result);
  })

};




exports.dbSqlRun = async function(pool, sqlExpr){
  //let sqlRequest = `insert into BanknoteList.dbo.event_log (event_Type, event_Point, event_Text,event_DT)  values ( '${eventType}', '${eventPoint}', '${eventText}', ${eventDT})`
  pool.request().query(sqlExpr)
  .then (result=>{
      //console.log(`Запись в лог ${sqlRequest}`)
     //console.log(result);
     
  })
  .catch(result=>{
     console.log(`${ new Date().toLocaleString()} : Ошибочка запроса ${sqlExpr}`)
     console.log(result);
  })

};

