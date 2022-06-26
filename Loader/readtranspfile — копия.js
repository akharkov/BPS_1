const fs = require('fs');
const path = require('path');
const fileMatch = require('file-match');
const server = require('./server.js');
const db = require("./db_module.js");
const other = require("./other.js");



const fDescript = require('./descriptors.js');


let filteredFiles = [];
let unFilteredFiles = [];
let filesList = [];
let curFileName=``;
let fContent = ``;



// module.exports.fDescript = fDescript;


// функция периодического вызова процесса опроса транспортного каталога.
    exports.scanFileForParser = function scanFileForParser(pathIN, fileMask, pathOut, pool) {
        //let fPars2 = require('./filetransportreader.js');
  
        other.myConsoleLog(`Запуск функции сканирования ${pathIN}, ${fileMask}, ${pathOut},`);
  
        //pathIN=this.pathIN, fileMask=this.fileMask, pathOut=this.pathOut, pool=this.pool
  
        let tik = setInterval(()=>{
            other.myConsoleLog(`Новый вызов сканироания ${pathIN}, ${fileMask}, ${pathOut},`);
        this.curFilePars(pathIN, fileMask, pathOut, pool);
        other.myConsoleLog(`вызов сканироания завершен`);
    
    
        }, 30*1000);
   
  
    };


// головная функция обработки транспортных файлов.
    exports.curFilePars = async function curFilePars(pathIN, fileMask, pathOut, pool /* ссыль на канал БД */){

        if(filesList.length===0) { // перестрахуемся и проверим, не работает ли уже данный процесс... Если массив пуст, значит процесс завершен
            filteredFiles = [];
            unFilteredFiles = [];
            
            other.myConsoleLog(`Новый вызов сканирования ${pathIN}, ${fileMask}, ${pathOut}`);

            const filter =  fileMatch(fileMask);
            files = fs.readdirSync(pathIN);

             
            filesList =  files.filter(function(e){
                return path.extname(e).toLowerCase() === '.dat'
            })
    
            for (var i=0;i<filesList.length;i++) {
                if (filter(filesList[i])) {filteredFiles.push(filesList[i])}
                else{unFilteredFiles.push(filesList[i])};
            };

                            
            for(var j=0;j<filteredFiles.length;j++){
                curFileName=``;
                fContent = ``;
                other.myConsoleLog(`Перемещаем файл ${filteredFiles[j]} j=${j} из ${pathIN} в ${pathOut}`);
                try{
                    if (fs.existsSync(`${pathIN}/${filteredFiles[j]}`)){
                        try {
                            fs.renameSync(`${pathIN}/${filteredFiles[j]}`,`${pathOut}/${filteredFiles[j]}`);
                            //const content = await  fileParser(pathIN, pathOut, filteredFiles, j);
                            curFileName = filteredFiles[j].toUpperCase();
                            other.myConsoleLog(`Start parser`);
                            // читаем данные из файла
                            try{
                                fContent = fs.readFileSync(`${pathOut}/${filteredFiles[j]}`, 'utf8');
                                //other.myConsoleLog(fContent);

                                try{
                                    

                                    let tmp = await this.parsContent(fContent);
                                    await this.loadToDB(pool, filteredFiles[j].toUpperCase(), tmp )



                                    
                                   
                                   
                                }catch (err){
                                    other.myConsoleLog(` Ошибка парсинга файла j= ${j} ${filteredFiles[j]} в ${pathOut}`, err);
                                }  ;
                            } catch (err){
                                other.myConsoleLog(` j= ${j} ошибка чтения файла  ${filteredFiles[j]} в ${pathOut}`, err);
                            }    
                        } 
                        catch (err) {                        
                            other.myConsoleLog(` j= ${j} Файл ${filteredFiles[j]} из ${pathIN} в ${pathOut} не перемещен`, err);
                        }
                    } else {
                        other.myConsoleLog(` j= ${j} Файл ${filteredFiles[j]} в ${pathIN} отсутствует`, err);
                    };
                } catch (err) {
                    other.myConsoleLog(` j= ${j} ошибка определения наличия файла  ${filteredFiles[j]} в ${pathIN}`, err);
                } 
            };

            filesList=[];
            other.myConsoleLog(`Обнулили. len= ${filesList.length} `, `filesList=${filesList}`);

        } else {
            other.myConsoleLog(`в данный момент идет обработка списка файлов в ранее запущенном процессе. len= ${filesList.length} `, `filesList=${filesList}`);
        };
        
    };







 exports.parsContent =  function parsContent(content) {

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
                if(!tmpStr.startsWith("/")) {
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


    return objTmp;


}








exports.loadToDB = async function loadToDB(pool, curFileName, objTmp2 , Office = `0000`){
    let sqlExpr;
    let tmp_rel_id_CashMachine = `${objTmp2.descriptMachine.Type}_${objTmp2.descriptMachine.MachineSN}_${objTmp2.descriptMachine.MachineID}`.replace(/ /g, "_").toUpperCase();
let rs, result;

// начинаем грузить данные файла в базу
// считаем, что файл не должен загружаться повторно. Это приведет к ошибке и отразится в ЛОГе

    sqlExpr = `select * from BanknoteList.dbo.t_TranspFile where FileName like  '${curFileName}' `;
/* 
    pool.request().query(sqlExpr, function(err,recordset){
        console.log(recordset[0].VehiCLASS);
        resultado = recordset[0].VehiCLASS;
      }    ) */
    


    rs =  await pool.request().query(sqlExpr);
    //.then(result=>{
        if(/* result */ rs.recordset.length===0) { // файл ранее не подгружался
            sqlExpr = `insert into BanknoteList.dbo.t_TranspFile (FileName, dt_Loaded)  values ('${curFileName}', '${objTmp2.descriptFile.Created}') `
    
            pool.request().query(sqlExpr)

                .then (result=>{
                    other.myConsoleLog(`Запись в DB ${sqlExpr}`)
                    db.dbLogAdd(pool,`Load transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); 

                    // проверяем наличие сведений о ССМ в справочнике ССМ


                    sqlExpr=``;
                    sqlExpr = `select * from BanknoteList.dbo.t_CashMachine where id_CashMachine like  '${tmp_rel_id_CashMachine}' `;

                    pool.request().query(sqlExpr)
                    .then (result=>{
                        let CashMachAdded = false;

                        

                        switch (result.recordset.length) { 
                            case 0: // ССМ  ранее не регистрировалась
                            
                                
                                other.myConsoleLog(`${ new Date().toLocaleString()} : ССМ не зарегистрирована ${tmp_rel_id_CashMachine}`)
                                db.dbLogAdd(pool,`ССМ не зарегистрирована`,`fparser.loadToDB`,`command=${tmp_rel_id_CashMachine}`,`convert(datetime,'${new Date().toISOString()}')`); 
                                // добавляем ССМ в локальный справочник

                                CashMachAdded = false;
                                // добавляем сведения о ССМ
                                sqlExpr=``;
                                sqlExpr = sqlExpr  + `insert into BanknoteList.dbo.t_CashMachine (id_CashMachine, MachineSN, MachineID, MachineType, OfficeID)` 
                                sqlExpr = sqlExpr  +` values ( '${tmp_rel_id_CashMachine}' , '${objTmp2.descriptMachine.MachineSN}' , '${objTmp2.descriptMachine.MachineID}', '${objTmp2.descriptMachine.Type}' , '${Office}') `; 
                                other.myConsoleLog(`${ new Date().toLocaleString()} : Add machine`);

                                pool.request().query(sqlExpr)

                                .then(result=>{
                                    CashMachAdded = true;
                                    other.myConsoleLog(`${ new Date().toLocaleString()} : Added machine`);
                                    db.dbLogAdd(pool,`ССМ зарегистрирована 1`,`fparser.loadToDB`,`ССМ =${tmp_rel_id_CashMachine}`,`convert(datetime,'${new Date().toISOString()}')`); 
                                    this.addDepositAndList(pool, curFileName, objTmp2 , Office = `0000`, tmp_rel_id_CashMachine);
                            
                                })
                                .catch(result=>{
                                    other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка 1 записи в DB ${sqlExpr}`,result)
                                    db.dbLogAdd(pool,`ErrorLoadDeposit1`,`fparser.fcontent File ${curFileName}`,`${result} --- command=${sqlExpr.replace(/'/g,"~")}  `,`convert(datetime,'${new Date().toISOString()}')`); 
                                    CashMachAdded = false;
                                }) ;
                                break;
                            case 1:   //ССМ зарегистрирована ранее

                                CashMachAdded = true;
                            

                                this.addDepositAndList(pool, curFileName, objTmp2 , Office = `0000`, tmp_rel_id_CashMachine);  
                                            
                                break;

                            default:
                                other.myConsoleLog(`${ new Date().toLocaleString()} : ССМ ${tmp_rel_id_CashMachine} зарегистрирована ${result.recordset.length} раз`,err)
                                db.dbLogAdd(pool,`ErrorLoadDeposit1`,`fparser.fcontent`,`ССМ ${tmp_rel_id_CashMachine} зарегистрирована ${result.recordset.length} раз`,`convert(datetime,'${new Date().toISOString()}')`); 
                                                                
                        };
                    })
                    .catch(result=>{
                        other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка запроса в DB ${sqlExpr}`)
                        db.dbLogAdd(pool,`ErrorLoadDeposit2`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 
                    
                    }) 
    
                })          
                .catch(result=>{
                    other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка 2 записи в DB ${sqlExpr}`)
                    db.dbLogAdd(pool,`Error load transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); 
                    
                }) 


        } else {

            //console.log(`${ new Date().toLocaleString()} : Найдена запись ${sqlExpr}`)ж
            db.dbLogAdd(pool,`double transport file`,`fparser.fcontent`,`transpFileName=${curFileName}`,`convert(datetime,'${new Date().toISOString()}')`); //${JSON.stringify(db_settings)}
        }
        
   // })
    /* .catch(result=>{
        other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка 3 записи в DB ${sqlExpr}`)
        console.log(result);
    }
    ); */


}



// функция добавления ССМ в локальный справочник
exports.addCashMachine =    function addCashMachine(){
    CashMachAdded = false;
    // добавляем сведения о ССМ
    sqlExpr=``;
    sqlExpr = `insert into BanknoteList.dbo.t_CashMachine (id_CashMachine, MachineSN, MachineID, MachineType, OfficeID) 
        values ( '${tmp_rel_id_CashMachine}' , '${objTmp2.descriptMachine.MachineSN}' , '${objTmp2.descriptMachine.MachineID}', '${objTmp2.descriptMachine.MachineType}' , '${Office}')  `;
    pool.request().query(sqlExpr)
    .then(result=>{

        console.log(result);

    })
    .catch(result=>{
        other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка 4 записи в DB ${sqlExpr}`)
        db.dbLogAdd(pool,`ErrorLoadDeposit3`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 
        CashMachAdded = false;
    }) ; 

    return CashMachAdded;

}



//добавление информации о депозите и купюрах (вынесено в отд ф-ю по причине проблем с async/await )
exports.addDepositAndList =  function addDepositAndList(fp_pool, fp_curFileName, fp_objTmp2 , fp_Office = `0000`, fp_tmp_rel_id_CashMachine){


   /*  if (CashMachAdded ) { */ //ССМ присутствует в справочнике
      try{                        
        //  грузим сведения о депозите
        sqlExpr=``;


        
        sqlExpr = sqlExpr  +   `insert into BanknoteList.dbo.t_Deposits ( ` ;
        sqlExpr = sqlExpr  +   `rel_id_CashMachine, rel_id_FileName, DepositStatus , DepositStartDateTime , DepositEndDateTime, SegmentFlag, PayoutCount ,`;
        sqlExpr = sqlExpr  +   `DeclaredAmount, CustomerID, DepositID, Currency, OpModeName, OperatorID , SNImageAvailability  ) `;
        sqlExpr = sqlExpr  +   ` values ( ` ;
        sqlExpr = sqlExpr  +   `'${fp_tmp_rel_id_CashMachine}', `;
        sqlExpr = sqlExpr  +   `'${fp_curFileName}', `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.DepositStatus}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.DepositStartDateTime}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.DepositEndDateTime}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.SegmentFlag}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.PayoutCount}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.DeclaredAmount}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.CustomerID}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.DepositID}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.Currency}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.OpModeName}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.OperatorID}' , `;
        sqlExpr = sqlExpr  +   `'${fp_objTmp2.descriptDeposit.SNImageAvailability}'  ) ` ;     
            
                
            
            



        other.myConsoleLog(`Deposit info ${sqlExpr}`)

        fp_pool.request().query(sqlExpr)
            .then (result=>{
                //other.myConsoleLog(`Запись в DB ${sqlExpr}`)
                //db.dbLogAdd(fp_pool,`LoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 

                // в цикле грузим данные купюр


                fp_objTmp2.descriptBN.forEach(element => {
                    sqlExpr=``; 
                    sqlExpr = `insert into BanknoteList.dbo.t_BnkNumList ( rel_id_Deposit ,DenomId ,Denom ,SNID ,SNLength ,dtStart ,QualityID ,OCID ,BNId ,SNImageID1 ,SNImageID2)`
                    sqlExpr =sqlExpr +` values ('${fp_curFileName}', '${element.DenomId}', '${element.Denom}','${element.SNID}',${element.SNLength},` ;  
                    sqlExpr =sqlExpr +` '${element.tStart}', '${element.QualityID}','${element.OCID}','${element.BNId}','${element.SNImageID1}','${element.SNImageID2}' )`;                 
                    fp_pool.request().query(sqlExpr)
                    .then (result=>{
                        console.log(`Запись в DB ${element.SNID}`);
                        console.log(result);

                        //db.dbLogAdd(pool,`LoadDeposit`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 






                    })
                    .catch(result=>{
                        console.log(`${ new Date().toLocaleString()} : Ошибочка записи в DB №№ купюр ${sqlExpr}`, result)
                        db.dbLogAdd(pool,`ErrorLoadDeposit`,`fparser.fcontent`,`Ошибочка записи в DB №№ купюр ${sqlExpr} res=${result}`,`convert(datetime,'${new Date().toISOString()}')`); 
                        
                    })                     

                            



                });






            })
            .catch(result=>{
                other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка записи в DB ${sqlExpr}`)
                db.dbLogAdd(fp_pool,`ErrorLoadDeposit5`,`fparser.fcontent`,`command=${sqlExpr}`,`convert(datetime,'${new Date().toISOString()}')`); 
            
            }) ; 
        }
        catch(result){
            other.myConsoleLog(`${ new Date().toLocaleString()} : Ошибочка в модуле  addDepositAndList `, result)
            db.dbLogAdd(pool,`ErrorLoadDeposit6`,`fparser.fcontent`,`Ошибочка в модуле  addDepositAndList ${result}`,`convert(datetime,'${new Date().toISOString()}')`); 

        }

        




   /*  } else { */
        // не удалось найти или добавить ССМ
        //other.myConsoleLog(`${ new Date().toLocaleString()} : не удалось найти или добавить ССМ ${tmp_rel_id_CashMachine}`)
        //db.dbLogAdd(pool,`ErrorLoadDeposit`,`fparser.fcontent`,`не удалось найти или добавить ССМ ${tmp_rel_id_CashMachine}`,`convert(datetime,'${new Date().toISOString()}')`); 

    //}



}