const express = require('express');
const app = express();
// const Connection = require('tedious').Connection;
// const Request = require('tedious').Request;
// const mssql = require('mssql');
const bodyParser = require('body-parser');
const moment = require('moment');
const db = require("./db");
const fs = require('fs');
const XlsxPopulate=require('xlsx-populate');

// const pool = new mssql.ConnectionPool(sqlConfig);

// var eventsData = [{
//   "title": "Служебная записка №394807",
//   "startdate": "2018/03/21",
//   "enddate": "2018/07/26",
//   "url": "http://www.example.com/1",
//   "type": "tourFly",
//   "minNight": "4",
//   "price": {


//   },
//   "tooltipData": {
//     "desc": [
//       "ОписаниеОписаниеОписаниеОписаниеОписание",
//       "ОписаниеОписаниеОписаниеОписаниеОписание",
//       "ОписаниеОписаниеОписаниеОписаниеОписание"
//     ],

//   }
// }];

let removereport = (queryObject) => {
  try {
		fs.unlink(__dirname+'/static/reports/'+queryObject['filename']+'.xlsx' , (err) => {
		if (err) err;
		return true;
	});


  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};



let xlsreport = (data) => {
	
var now = new Date();
var filename='';
filename = now.getFullYear()+''+now.getMonth()+''+now.getDate()+'-'+Math.floor(Math.random()*20000) + 5;

var aa='';
XlsxPopulate.fromBlankAsync()
    .then(workbook => {	
		let idx=2;//second row
		
		
			workbook.sheet('Sheet1').cell("A1").value('Название С/З');
			workbook.sheet('Sheet1').cell("B1").value('Инициатор');
			workbook.sheet('Sheet1').cell("C1").value('Описание');
			workbook.sheet('Sheet1').cell("D1").value('Задач/Исполнено');
			workbook.sheet('Sheet1').cell("E1").value('Дата начала');
			workbook.sheet('Sheet1').cell("F1").value('Дата окончания');
			
			for(i=0;i<=data['arrayData'].length-1;i++)
			{
				workbook.sheet('Sheet1').cell("A"+idx).value(data["arrayData"][i]["title"]).style({ fontColor: "0563c1", underline: true })
    .hyperlink(data["arrayData"][i]["url"]);
				workbook.sheet('Sheet1').cell("B"+idx).value(data['arrayData'][i]['tooltipData']['desc'][1]);
				workbook.sheet('Sheet1').cell("C"+idx).value(data['arrayData'][i]['tooltipData']['desc'][2]);
				workbook.sheet('Sheet1').cell("D"+idx).value(data['arrayData'][i]['tasks']+'/'+data['arrayData'][i]['tasksCompleted']);
				workbook.sheet('Sheet1').cell("E"+idx).value(data['arrayData'][i]['startdate']);
				workbook.sheet('Sheet1').cell("F"+idx).value(data['arrayData'][i]['enddate']);
				idx++;
			
			}
			workbook.toFileAsync(__dirname+"/static/reports/"+filename+".xlsx");
    });
	return filename;
}


let datePrepare = (date) => {
  if (!date) return false;
  let result = moment(date).format('YYYY[/]MM[/]DD');
  return result;
}

// Задействуем midware боди парсер для разбора ответов

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Функция запрос к базе данных, получает объект данными фильтров из морды. если фильтры без данных запрашивает по умолчанию.

// async function executeDB(query) {

//   return new Promise((resolve, reject) => {
//     debugger;
//     pool.connect().then(pool => {
//       return pool.request().query(query)
//     }).then(result => {
//       console.log(result);
//       resolve(result.recordset);

//       pool.close();
//     }).catch(err => {

//       reject(err)
//       pool.close();
//     });
//   });
// }

async function queryDB(queryObject) {
  try {
    console.log('Try to connecting to DB...RefreshGant');

    let { startdate, enddate, typeSZ, viewSZ, users_id } = queryObject;

   //console.log(`deportament id - ${deportament_id}\n user id - ${users_id}`);

    let queryDate = (parameter) => {
      if (parameter) {
        return moment(parameter).format('MM[/]DD[/]YYYY');
      } else {
        return false;
      }
    }
	
    let explodeDate = (parameter) => {
      if (parameter) {
        return parameter.split("-");
      } else {
        return false;
      }
    }

    // 

    let now = new Date();
	
	if(startdate!='' && enddate!=''){
		start = startdate; 
		end = enddate;
	}
	if(startdate=='' && enddate==''){
		let date= `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
		let fy = now.getFullYear();
		let mm = Number(explodeDate(date)[1]);
		let ed;
		if(mm==10){ed=1;sd=mm-1;fyed=fy+1;}
		else if(mm==11){ed=2;sd=mm-1;fyed=fy+1;}
		else if(ed==12){ed=3;sd=mm-1;fyed=fy+1;}
		else{ed=mm+3;sd=mm-1;}
		
		start = `${fy}-${sd}-${now.getDate()}`; 
		end =  `${fyed}-${ed}-${now.getDate()}`;
	}
	if(startdate!='' && enddate==''){
		let ed = Number(explodeDate(startdate)[1]);
		let year = Number(explodeDate(startdate)[0]);
		let fy = now.getFullYear();
		if(ed==10){ed=1;fy=fy+1;}
		else if(ed==11){ed=2;fy=fy+1;}
		else if(ed==12){ed=3;fy=fy+1;}
		else{ed=ed+2;}
		start = startdate; 
		end =  `${year}-${ed}-${now.getDate()}`;
	}
	if(startdate=='' && enddate!=''){
		let ed = Number(explodeDate(enddate)[1]);
		let fy = now.getFullYear();
		if(ed==11){ed=ed-2;}else if(ed==12){ed=ed-2;}else if(ed==1){ed=11;fy=fy-1;}else if(ed==2){ed=12;fy=fy-1;}else{ed=ed-2;}
		start = `${fy}-${ed}-${now.getDate()}`; 
		end =  enddate;
	}
	
    let dept, user;
	
	let sqlquery2 = `
    declare   @dt_Start as datetime ='${start}'
    declare   @dt_End   as datetime = '${end}'
    declare   @i_Arc    as int = 0
    /*declare   @t_Link   as text = "lll"*/
	/*1*/

	 SELECT doc.[ID]
      ,doc.[AuthorID]
      ,doc.[Регистрационный номер]
      ,doc.[Дата регистрации]
      ,doc.[Содержание]
      ,doc.[Инициатор]
      ,doc.[Срок исполнения]
      ,doc.[Дата начала выполнения работ]
      ,doc.[Дата окончания выполнения работ]
	  ,Users.[Имя пользователя]
	  ,count(isp.[ID]) as "Задач"
	  ,count(isp.[Дата решения]) as "Исполнено"
  FROM [dbo].[list_dms_erequests__ERequests_130_primary] as doc
  JOIN DBF_Content.dbo.DBUsers as Users ON Users.ID = doc.[Инициатор]
  join [DBF_Content].[dbo].[list_dms_erequests__AB_isp_738] as isp on isp.[Служебные записки] = doc.[ID]
  where doc.[Дата начала выполнения работ]>= @dt_Start and doc.[Дата окончания выполнения работ]<=@dt_End
  and doc.[Дата начала выполнения работ] IS NOT NULL and doc.[Дата окончания выполнения работ] IS NOT NULL
  group by doc.[ID],doc.[AuthorID],doc.[Регистрационный номер],doc.[Дата регистрации],doc.[Содержание],doc.[Инициатор],doc.[Срок исполнения],doc.[Дата начала выполнения работ],doc.[Дата окончания выполнения работ],Users.[Имя пользователя]
`;

	 let sqlqueryTypeSZ = `
    declare   @dt_Start as datetime ='${start}'
    declare   @dt_End   as datetime = '${end}'
    declare   @i_Arc    as int = 0
    /*declare   @t_Link   as text = "lll"*/

	SELECT doc.[ID]
      ,doc.[AuthorID]
      ,doc.[Регистрационный номер]
      ,doc.[Дата регистрации]
      ,doc.[Содержание]
      ,doc.[Инициатор]
      ,doc.[Срок исполнения]
      ,doc.[Дата начала выполнения работ]
      ,doc.[Дата окончания выполнения работ]
	  ,Users.[Имя пользователя]
	  ,count(isp.[ID]) as "Задач"
	  ,count(isp.[Дата решения]) as "Исполнено"
  FROM [dbo].[list_dms_erequests__ERequests_130_primary] as doc
  JOIN DBF_Content.dbo.DBUsers as Users ON Users.ID = doc.[Инициатор]
  join [DBF_Content].[dbo].[list_dms_erequests__AB_isp_738] as isp on isp.[Служебные записки] = doc.[ID]
  where doc.[Дата начала выполнения работ]>= @dt_Start and doc.[Дата окончания выполнения работ]<=@dt_End
  and doc.[Дата начала выполнения работ] IS NOT NULL and doc.[Дата окончания выполнения работ] IS NOT NULL
  and doc.[Вид служебной записки] = ${typeSZ}
  group by doc.[ID],doc.[AuthorID],doc.[Регистрационный номер],doc.[Дата регистрации],doc.[Содержание],doc.[Инициатор],doc.[Срок исполнения],doc.[Дата начала выполнения работ],doc.[Дата окончания выполнения работ],Users.[Имя пользователя]
   
    `;
	
	let sqlqueryTypeSZViewSZ = `
    declare   @dt_Start as datetime ='${start}'
    declare   @dt_End   as datetime = '${end}'
    declare   @i_Arc    as int = 0
    /*declare   @t_Link   as text = "lll"*/

	SELECT doc.[ID]
      ,doc.[AuthorID]
      ,doc.[Регистрационный номер]
      ,doc.[Дата регистрации]
      ,doc.[Содержание]
      ,doc.[Инициатор]
      ,doc.[Срок исполнения]
      ,doc.[Дата начала выполнения работ]
      ,doc.[Дата окончания выполнения работ]
	  ,Users.[Имя пользователя]
	  ,count(isp.[ID]) as "Задач"
	  ,count(isp.[Дата решения]) as "Исполнено"
  FROM [dbo].[list_dms_erequests__ERequests_130_primary] as doc
  JOIN DBF_Content.dbo.DBUsers as Users ON Users.ID = doc.[Инициатор]
  join [DBF_Content].[dbo].[list_dms_erequests__AB_isp_738] as isp on isp.[Служебные записки] = doc.[ID]
  where doc.[Дата начала выполнения работ]>= @dt_Start and doc.[Дата окончания выполнения работ]<=@dt_End
  and doc.[Дата начала выполнения работ] IS NOT NULL and doc.[Дата окончания выполнения работ] IS NOT NULL
  and doc.[Вид служебной записки] = ${typeSZ}
  and doc.[Вид деятельности] is not null
  and doc.[Вид деятельности] = ${viewSZ}
  group by doc.[ID],doc.[AuthorID],doc.[Регистрационный номер],doc.[Дата регистрации],doc.[Содержание],doc.[Инициатор],doc.[Срок исполнения],doc.[Дата начала выполнения работ],doc.[Дата окончания выполнения работ],Users.[Имя пользователя]
    `;
	
	
	
    let sqlqueryTypeSZandUser = `
    declare   @dt_Start as datetime ='${start}'
    declare   @dt_End   as datetime = '${end}'
    declare   @i_Arc    as int = 0
    /*declare   @t_Link   as text = "lll"*/

	SELECT doc.[ID]
      ,doc.[AuthorID]
      ,doc.[Регистрационный номер]
      ,doc.[Дата регистрации]
      ,doc.[Содержание]
      ,doc.[Инициатор]
      ,doc.[Срок исполнения]
      ,doc.[Дата начала выполнения работ]
      ,doc.[Дата окончания выполнения работ]
	  ,Users.[Имя пользователя]
	  ,count(isp.[ID]) as "Задач"
	  ,count(isp.[Дата решения]) as "Исполнено"
  FROM [dbo].[list_dms_erequests__ERequests_130_primary] as doc
  JOIN DBF_Content.dbo.DBUsers as Users ON Users.ID = doc.[Инициатор]
  join [DBF_Content].[dbo].[list_dms_erequests__AB_isp_738] as isp on isp.[Служебные записки] = doc.[ID]
  where doc.[Дата начала выполнения работ]>= @dt_Start and doc.[Дата окончания выполнения работ]<=@dt_End
  and doc.[Дата начала выполнения работ] IS NOT NULL and doc.[Дата окончания выполнения работ] IS NOT NULL
  and doc.[Инициатор] = ${users_id}
  and doc.[Вид служебной записки] = ${typeSZ}
  group by doc.[ID],doc.[AuthorID],doc.[Регистрационный номер],doc.[Дата регистрации],doc.[Содержание],doc.[Инициатор],doc.[Срок исполнения],doc.[Дата начала выполнения работ],doc.[Дата окончания выполнения работ],Users.[Имя пользователя]
	`
	;

    let sqlqueryAll = `
    declare   @dt_Start as datetime ='${start}'
    declare   @dt_End   as datetime = '${end}'
    declare   @i_Arc    as int = 0
    /*declare   @t_Link   as text = "lll"*/
	
	SELECT doc.[ID]
      ,doc.[AuthorID]
      ,doc.[Регистрационный номер]
      ,doc.[Дата регистрации]
      ,doc.[Содержание]
      ,doc.[Инициатор]
      ,doc.[Срок исполнения]
      ,doc.[Дата начала выполнения работ]
      ,doc.[Дата окончания выполнения работ]
	  ,Users.[Имя пользователя]
	  ,count(isp.[ID]) as "Задач"
	  ,count(isp.[Дата решения]) as "Исполнено"
  FROM [dbo].[list_dms_erequests__ERequests_130_primary] as doc
  JOIN DBF_Content.dbo.DBUsers as Users ON Users.ID = doc.[Инициатор]
  join [DBF_Content].[dbo].[list_dms_erequests__AB_isp_738] as isp on isp.[Служебные записки] = doc.[ID]
  where doc.[Дата начала выполнения работ]>= @dt_Start and doc.[Дата окончания выполнения работ]<=@dt_End
  and doc.[Дата начала выполнения работ] IS NOT NULL and doc.[Дата окончания выполнения работ] IS NOT NULL
  and doc.[Вид служебной записки] = ${typeSZ}
  and doc.[Вид деятельности] is not null
  and doc.[Вид деятельности] = ${viewSZ}
  and doc.[Инициатор] = ${users_id}
  group by doc.[ID],doc.[AuthorID],doc.[Регистрационный номер],doc.[Дата регистрации],doc.[Содержание],doc.[Инициатор],doc.[Срок исполнения],doc.[Дата начала выполнения работ],doc.[Дата окончания выполнения работ],Users.[Имя пользователя]
    `;

    if(typeSZ && !viewSZ && !users_id) {
      query = sqlqueryTypeSZ;
    }

    if(typeSZ && viewSZ && !users_id) {
      query = sqlqueryTypeSZViewSZ;
    }
	
	if(typeSZ && !viewSZ && users_id) {
      query = sqlqueryTypeSZandUser;
    }
	
    if(typeSZ && viewSZ && users_id) {
      query = sqlqueryAll
    }

    if(!typeSZ && !viewSZ && !users_id) {
      query = sqlquery2;
    }

    let result = await db.execSql(query);
    if(result.success) return result.success;
    if(result.err) {
      console.log(`Ошибка запроса к базе данных: ${result.err}`);
    }
  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};

async function queryDeparts(queryObject) {
  try {
    console.log('Try to connecting to DB...Departments');
    // let pool = await mssql.connect(sqlConfig);


    let sqlquery = 'select "ID", "Название" from [DBF_Content].[dbo].[list__Departments_3] where (Deleted IS NULL) and ([Является ИТ-подразделением] = 0)';

    let result = await db.execSql(sqlquery);
    return result.success;
  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};




async function queryUsers(paramsObject) {
  try {
    console.log('Try to connecting to DB...Users');
    // let pool = await sql.connect(sqlConfig);

    // if (!pool) {
    //   pool = await sql.connect(sqlConfig);
    // }

    // debugger;
    let { deportament_id } = paramsObject;

    let sqlquery = `SELECT [ID]
      , [Имя пользователя]
      FROM[DBF_Content].[dbo].[DBUsers]
    where([Deleted] is null or[Deleted] = 0)
    and[Уволен] = 0
    and[Системная запись] = 0
    and[Не актуален] = 0
`;
    let sqlquery2 = `SELECT [ID]
      , [Имя пользователя]
      FROM[DBF_Content].[dbo].[DBUsers]
    where([Deleted] is null or[Deleted] = 0)
    and[Уволен] = 0
    and[Системная запись] = 0
    and[Не актуален] = 0
    and [Подразделение] = ${deportament_id}
`;

    let query = deportament_id ? sqlquery2 : sqlquery;

    let result = await db.execSql(query);
    // console.log(result.success);
    return result.success;
  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};

async function queryTypeSZ() {
  try {
    console.log('Try to connecting to DB...TypeSZ');

    let sqlquery = `SELECT [ID],[ListID],[Deleted],[Название],[Не актуален]
		FROM [DBF_Content].[dbo].[list_dms__RequestTypes_86] 
		WHERE [Deleted] is NULL
	`;


    let result = await db.execSql(sqlquery);
    //console.log(result.success);
    return result.success;
  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};

async function queryViewSZ(paramsObject) {
  try {
    console.log('Try to connecting to DB...view_sz');

    let sqlquery = `
	SELECT  podvid.[ID] ,podvid.[Название]
	FROM [DBF_Content].[dbo].[list_dms_erequests__podvid_815] as podvid
	left join [DBF_Content].[dbo].[list_dms_erequests__ERequests_130_primary] as typesz on typesz.[Вид служебной записки] = ${paramsObject} and typesz.[Вид деятельности] is not null
	where podvid.ID = typesz.[Вид деятельности]
	`;

    let result = await db.execSql(sqlquery);
    return result.success;
  } catch (err) {
    // ... error checks
    console.log('Err: ', err);
    res.status(500).send({ message: err });
  }
};

//WEB SERVER

var PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/departaments', (req, res) => {
  // console.log('Query`s: ', req.query.startdate, req.query.enddate, req.query.filter1, req.query.filter2, req.query.filter3)
  // console.log(req.query);
  // res.sendFile(__dirname + '/dep.json');
  // let request = new db.Request();
  // let sqlquery = 'select "ID", "Название" from [DBF_Content].[dbo].[list__Departments_3] where (Deleted IS NULL) and ([Является ИТ-подразделением] = 0)';

  queryDeparts().then(data => {
    // let temp = data.recordsets[0];
    // console.log(temp);
    let result = data.map((cur, index) => {
      return {
        id: cur["ID"] || "Test number",
        name: cur["Название"],
      }
    });
    res.json(result);
  }).catch(e => {
    console.log(`Ошибка в queryDeparts: ${e}`);
  });

});


app.get('/xlsreport', (req, res) => {
    let result = xlsreport(req.query);
    res.send(result);
});
app.get('/remreport', (req, res) => {
    let result = removereport(req.query);
    res.send(result);
});

app.get('/users', (req, res) => {
  // console.log('Query`s: ', req.query.startdate, req.query.enddate, req.query.filter1, req.query.filter2, req.query.filter3)
  // console.log(req.query);
  // res.sendFile(__dirname + '/users.json');
  // console.log(`Request params ${req.params.deportament_id}, ${req.params}`);
  // debugger;
  queryUsers(req.query).then(data => {
    // let temp = data.recordsets[0];
    // console.log(`Req.params ${req.params}`);
    
    let result = data.map((cur, index) => {
      return {
        id: cur["ID"] || "Test number",
        name: cur["Имя пользователя"],
      }
    });
    // console.log(result);
    res.json(result);
  }).catch(e => {
    console.log(`Ошибка в queryUsers: ${e}`);
  });
});
app.get('/typeSZ', (req, res) => {

  queryTypeSZ().then(data => {
    // console.log(result);
    res.json(data);
  }).catch(e => {
    console.log(`Ошибка в typeSZ: ${e}`);
  });
});
app.get('/view_sz', (req, res) => {

  queryViewSZ(req.query['typeSZ']).then(data => {
    //console.log(req.query['typeSZ']);
    res.json(data);
  }).catch(e => {
    console.log(`Ошибка в ViewSZ: ${e}`);
  });
});

app.get('/refresh', (req, res) => {
   //console.log('Query`s: ', req.query.startdate, req.query.enddate, req.query.filter1, req.query.filter2, req.query.filter3)
  //console.log(`/refresh req.query ${req.query.typeSZ}`);

  let getNights = (startdate, enddate) => {
    if (startdate && enddate) {
      let start = startdate;
      let end = enddate;

      let diff = end - start;

      let milliseconds = diff;
      let seconds = milliseconds / 1000;
      let minutes = seconds / 60;
      let hours = minutes / 60;
      let days = hours / 24;

      return Math.ceil(days);
    }
    return ""
  }

  queryDB(req.query).then((data) => {
	  
    let result = data.map((item, index) => {
		console.log(item);
      return {
        title: `${item["Исполнено"]}/${item["Задач"]} ${item["Регистрационный номер"]}`,
        startdate: datePrepare(item["Дата начала выполнения работ"]) || "2018/05/21",
        enddate: datePrepare(item["Дата окончания выполнения работ"]) || "2018/07/21",
        url: item["ID"] ? `http://docspred/dms/erequests/_layouts/WSS/Lists/list_dms_erequests__ERequests_130/EditForm.aspx?ID=${item["ID"]}` : 'http://www.example.com/1',
        minNight: getNights(item["Дата начала выполнения работ"], item["Дата окончания выполнения работ"]),
        type: "tourFly",
        tasks: item["Задач"],
        tasksCompleted: item["Исполнено"],
        tooltipData: {
                        "desc": [
                          "Выполнено: "+item["Исполнено"]+" / "+item["Задач"],
                          "Инициатор - " + item["Имя пользователя"],
                          item["Содержание"] || "Содержание"
                        ]
                      }
        }
    });
    res.json(result);
  }).catch(e => { console.log(`в queryDB ошибка: ${e}`) });
});

app.get('/:file', (req, res) => {
  res.sendFile(__dirname + '/' + req.params.file)
});

app.get('/:path/:name', (req, res, next) => {
  var options = {
    root: __dirname + '/static/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  var path = req.params.path;
  var fileName = req.params.name;

  res.sendFile(path + '/' + fileName, options, function (err) {
    if (err) {
      console.log(err);
      (err);
    } else {
      // console.log(req.ip, ' Sent: ', fileName);
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

