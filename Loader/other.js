


exports.myConsoleLog = async function myConsoleLog(message, er = ``){

    console.log(`============================================================================`);
    console.log(`${ new Date().toLocaleString()} : ${message} : `)
    console.log(`${er}`);
    console.log(`============================================================================`);

    
}