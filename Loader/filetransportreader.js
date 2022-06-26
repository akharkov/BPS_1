

const fs = require('fs');
const path = require('path');
const fileMatch = require('file-match');
const server = require('./server.js');
const db = require("./db_module.js");


const fDescript = require('./descriptors.js');
module.exports.fDescript = fDescript;

const { constants } = require('perf_hooks');



let filteredFiles = [];
let unFilteredFiles = [];
let filesList;
let curFileName=``;


exports.curFilePars = /* async */ function curFilePars(pathIN, fileMask, pathOut, pool /* ссыль на канал БД */){
  const filter =  fileMatch(fileMask);

  console.log(`${ new Date().toLocaleString()} : 2 Новый вызов сканироания ${pathIN}, ${fileMask}, ${pathOut},`);

  fs.readdir(pathIN, /* async */ function(err, files){

console.log(`Files ${files}`);

    if(err){console.log(`Errorochka ${err}`)}
    else{
        filesList =  /* await */ files.filter(function(e){
            return path.extname(e).toLowerCase() === '.dat'
        })

        for (var i=0;i<filesList.length;i++) {
            if (filter(filesList[i])) {filteredFiles.push(filesList[i])}
            else{unFilteredFiles.push(filesList[i])};
        };

        for(var j=0;j<filteredFiles.length;j++){
          curFileName=``;
          console.log(`Перемещаем файл ${filteredFiles[j]} из ${pathIN} в ${pathOut}`);
          
            //const content = await  fileParser(pathIN, pathOut, filteredFiles, j);
            curFileName = filteredFiles[j]
            console.log(`${ new Date().toLocaleString()} : Start parser`);
            readFile2(pathIN, pathOut, filteredFiles, j , pool ) 
             
            

        };
      };
    });
  };



async function fileParser(path_IN, path_Out, filtered_Files, y){
  /* console.log(`y==${y}`);
  console.log(`filteredFiles= ${filtered_Files}`);
  console.log(`filteredFiles[${y}]= ${filtered_Files[y]}`); */

  fs.rename(`${path_IN}/${filteredFiles[y]}`,`${path_Out}/${filtered_Files[y]}`, /* async */ (err) => {
    
    if(err) {`Файл ${filteredFiles[y]} из ${path_IN} в ${path_Out} не перемещен`}                 // не удалось переместить файл
    else{
      console.log(`Файл ${filtered_Files[y]} из ${path_IN} в ${path_Out} перемещен`);
      console.log(`чтениe файла ${y} ${filtered_Files[y]} `);

      try {
        //const content = await fs.readFileSync(`${path_Out}/${filtered_Files[y]}`, 'utf8');
        //console.log(content);
        //return  fs.readFileSync(`${path_Out}/${filtered_Files[y]}`, 'utf8');
        const cont = /* await */ readFile(`${path_Out}/${filtered_Files[y]}`);
        console.log(`cont =====  ${cont}`);
        
        return cont;



      }
      catch (e) {
        console.log(`Ошибка чтения файла ${y} ${filtered_Files[y]} : ${e}`);
        //вернуть во входящие


      }
    }
  });

}


//await readFile("path/to/file");
/* async */  function readFile2(path_IN, path_Out, filtered_Files, y, pool, callback) {

  
  fs.renameSync(`${path_IN}/${filteredFiles[y]}`,`${path_Out}/${filtered_Files[y]}`, (err) => {
    if(err) {`Файл ${filteredFiles[y]} из ${path_IN} в ${path_Out} не перемещен`}                 // не удалось переместить файл
    else{

      const fpath = path.resolve(`${path_Out}/${filtered_Files[y]}`);
      console.log(`fpath == ${fpath}`);

      let fContent =     new Promise((resolve, reject) => {
        fs.readFile(fpath, 'utf8', function (err, data) {
          if (err) {
            console.log(`Error on function readFile2  File ${filtered_Files[y]}`);
            reject(err);
          } else {
            resolve(data);
          };
        });
        


        
      });

       fContent.then(content=>{
        let objTmp={};
        let curObj=[];
        let tmpObj2={};
        let tmpStr, tmpStr2, keyStr;
        let arrContent = content.split('<') ;   

        const keys = Object.keys(fDescript.descriptBpsFile);

        keys.forEach(descrElem => {
          
          objTmp[descrElem]={}; // создаем пустой подобъект раздела в объекте информации

          curObj=Object.values(fDescript.descriptBpsFile[descrElem].structureData); //получаем список "полей" для парсинга строк данных

            // фиксируем соглашение о том, что структура данных представлена парой <имяПараметра>="<значениеПараметра>"
            // <имяПараметра> получаем через element
            // необходимо обратить внимание на частный случай частичного совпадения ключей (DenomId = Denom*). 
            // для устранения совпадения при поиске вхождения в качестве ключа используем комбинацию ведущего "пробела", значения ключа (element) и замыкающего символа "="
            // т.о. <значениеПараметра> будет извлекаться с позиции вхождения " "+<имяПараметра>+"="+число_знаков((" "+<имяПараметра>+"="))+ 1 ('"')
            // и продолжится до ближайшего символа '"'
            //


          if(fDescript.descriptBpsFile[descrElem].lineEnd>0) {   // однострочные данные

            tmpObj2 = {} /* objTmp[descrElem] */; // выделяем подобъект во временную переменную для заполнения и последующим перепресвоением (полагаем, что данные однострочные)
            tmpStr=arrContent[fDescript.descriptBpsFile[descrElem].lineStart];
  
            curObj.forEach(element => {  //перебираем ключи параметров в строке информации
              keyStr = ` ${element}=`; 
  
              tmpStr2= tmpStr.substring(tmpStr.indexOf(keyStr)+1+keyStr.length,  tmpStr.indexOf('"', tmpStr.indexOf(keyStr)+1+keyStr.length) );  //вырезаем значение для ключа keyStr
              
              tmpObj2[element]=tmpStr2; //Object.assign(tmpObj2[element], tmpStr2);
            });
  
            objTmp[descrElem] = tmpObj2; // возвращаем сформированный подобъект в объект основных данных

          } else {                       // данные представлены в виде массива строк. Читаем до конца  массива, полагая, что далее нет иных разделов
            let arrData = [];

            for(let i=fDescript.descriptBpsFile[descrElem].lineStart;i < arrContent.length; i++){  //перебираем массив строк информации

              tmpObj2 = {};
              tmpStr=arrContent[i]; // получаем строку из массива информации
              if(!tmpStr.startsWith("/")){
                curObj.forEach(element => {  //перебираем ключи параметров в строке информации
                  keyStr = ` ${element}=`; 
                  tmpStr2= tmpStr.substring(tmpStr.indexOf(keyStr)+1+keyStr.length,  tmpStr.indexOf('"', tmpStr.indexOf(keyStr)+1+keyStr.length) ); //вырезаем значение для ключа keyStr
                  tmpObj2[element]=tmpStr2;
                });
                arrData.push(tmpObj2);               

              };
              
            };
            objTmp[descrElem] = arrData;
          };

        });


        curFileName = path.basename(fpath).toUpperCase();
        console.log(`${ new Date().toLocaleString()} : получен результат парсинга файла ${fpath}`);

        
        /* res = await  pool.request().query(sqlExpr);
        console.log(res); */


// начинаем грузить данные файла в базу
// считаем, что файл не должен загружаться повторно. Это приведет к ошибке и отразится в ЛОГе

        sqlExpr = `select * from BanknoteList.dbo.t_TranspFile where FileName like  '${curFileName}' `;
        pool.request().query(sqlExpr)
        .then(result=>{
            if(result.recordset.length===0) { // файл ранее не подгружался
              sqlExpr = `insert into BanknoteList.dbo.t_TranspFile (FileName, dt_Loaded)  values ('${curFileName}', '${objTmp.descriptFile.Created}') `
          
              pool.request().query(sqlExpr)
                .then (result=>{
                  console.log(`Запись в DB ${sqlExpr}`)
                  db.dbLogAdd(pool,`Load transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); 
// файл не является дублем, грузим сведения о депозите

            

                  sqlExpr = `insert into BanknoteList.dbo.t_Deposits ( ` +
                    `rel_id_CashMachine, rel_id_FileName, DepositStatus , DepositStartDateTime , DepositEndDateTime, SegmentFlag, PayoutCount ,`+
                    `DeclaredAmount, CustomerID, DepositID, Currency, OpModeName, OperatorID , SNImageAvailability  ) ` +
                    ` values ( ` +
                    `'${objTmp.Machine.Type}-${objTmp.Machine.MachineSN}-${objTmp.Machine.MachineID}', `+
                    `'${curFileName}', `+
                    `'${objTmp.Deposit.DepositEndDateTime}' , `+
                    `'${objTmp.Deposit.SegmentFlag}' , `+
                    `'${objTmp.Deposit.PayoutCount}' , `+
                    `'${objTmp.Deposit.DeclaredAmount}' , `+
                    `'${objTmp.Deposit.CustomerID}' , `+
                    `'${objTmp.Deposit.DepositID}' , `+
                    `'${objTmp.Deposit.Currency}' , `+
                    `'${objTmp.Deposit.OpModeName}' , `+
                    `'${objTmp.Deposit.OperatorID}' , `+
                    `'${objTmp.Deposit.SNImageAvailability}'  ) ` ;                    
                     
                     


/*

                  sqlExpr = `insert into BanknoteList.dbo.t_Deposits ( 
                   rel_id_CashMachine,
                   rel_id_FileName, 
                   DepositStatus , 
                   DepositStartDateTime ,
                   DepositEndDateTime ,
                   SegmentFlag ,
                   PayoutCount ,
                   DeclaredAmount ,
                   CustomerID ,
                   DepositID ,
                   Currency ,
                   OpModeName ,
                   OperatorID ,
                   SNImageAvailability  )  
                   
                   values ( 
                    '${objTmp.Machine.Type}-${objTmp.Machine.MachineSN}-${objTmp.Machine.MachineID}',
                    '${curFileName}',
                    '${objTmp.Deposit.DepositEndDateTime}' ,
                    '${objTmp.Deposit.SegmentFlag}' ,
                    '${objTmp.Deposit.PayoutCount}' ,
                    '${objTmp.Deposit.DeclaredAmount}' ,
                    '${objTmp.Deposit.CustomerID}' ,
                    '${objTmp.Deposit.DepositID}' ,
                    '${objTmp.Deposit.Currency}' ,
                    '${objTmp.Deposit.OpModeName}' ,
                    '${objTmp.Deposit.OperatorID}' ,
                    '${objTmp.Deposit.SNImageAvailability}'                     
                     
                     ) ` ;

*/

                        console.log(`Deposi info ${sqlExpr}`)

                   pool.request().query(sqlExpr)
                    .then (result=>{
                      console.log(`Запись в DB ${sqlExpr}`)
                      db.dbLogAdd(pool,`LoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 


                      /*

                      // в цикле грузим данные купюр
                                          sqlExpr = `insert into BanknoteList.dbo.t_Deposits (FileName, dt_Loaded)  values ('${curFileName}', '${objTmp.descriptFile.Created}') `

                                          pool.request().query(sqlExpr)
                                          .then (result=>{
                                            console.log(`Запись в DB ${sqlExpr}`)
                                            db.dbLogAdd(pool,`LoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 






                                          })
                                          .catch(result=>{
                                            console.log(`${ new Date().toLocaleString()} : Ошибочка записи в DB ${sqlExpr}`)
                                            db.dbLogAdd(pool,`ErrorLoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 
                                            
                                          }) 


                      */



                    })
                    .catch(result=>{
                      console.log(`${ new Date().toLocaleString()} : Ошибочка записи в DB ${sqlExpr}`)
                      db.dbLogAdd(pool,`ErrorLoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 
                      
                    }) 





                  
                
                })
                .catch(result=>{
                  console.log(`${ new Date().toLocaleString()} : Ошибочка записи в DB ${sqlExpr}`)
                  db.dbLogAdd(pool,`Error load transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); 
                  
                }) 


            } else {

              //console.log(`${ new Date().toLocaleString()} : Найдена запись ${sqlExpr}`)ж
              db.dbLogAdd(pool,`double transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); //${JSON.stringify(db_settings)}
            }
            
          }

        )
        .catch(result=>{
            console.log(`${ new Date().toLocaleString()} : Ошибочка записи в DB ${sqlExpr}`)
            console.log(result);
          }
        );




 
        console.log(`${ new Date().toLocaleString()} : отправлен запрос ${sqlExpr}`);


        // раскладываем результат по таблицам

        // проверяем, подгружался ли ранее файл





//console.log(objTmp);
// return objTmp;


      });
    };

  });

  
  
}







/* 
exports.scan_Files = async function scan_Files(pathIN, fileMask, pathOut, pool){
  let i = 0;
  let y = 0;
  let z = 0;

  while(!server.config.scanFilesBreak){
   
    if (server.config.scanFiles){
      console.log(`${ new Date().toLocaleString()} :  Новый вызов сканироания ${pathIN}, ${fileMask}, ${pathOut},`);

      await this.curFilePars(pathIN, fileMask, pathOut, pool);

      console.log(`${ new Date().toLocaleString()} :  вызов сканироания завершен`);
      server.config.scanFilesBreak = !server.config.scanFilesBreak;


    }
   
  } 
} */



exports.scanFileForParser = function scanFileForParser(pathIN, fileMask, pathOut, pool) {
  //let fPars2 = require('./filetransportreader.js');

  console.log(`${ new Date().toLocaleString()} :  Запуск функции сканирования ${pathIN}, ${fileMask}, ${pathOut},`);

//pathIN=this.pathIN, fileMask=this.fileMask, pathOut=this.pathOut, pool=this.pool

  let tik = setInterval(()=>{
    console.log(`${ new Date().toLocaleString()} :  Новый вызов сканироания ${pathIN}, ${fileMask}, ${pathOut},`);
    this.curFilePars(pathIN, fileMask, pathOut, pool);
    console.log(`${ new Date().toLocaleString()} :  вызов сканироания завершен`);


  }, 10000);
 

  };