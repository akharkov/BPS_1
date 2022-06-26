// здесь будут собраны описатели структур 
// различных объектов и базы данных


// описание структуры транспортного файла BPS (начало)

let descriptBpsFile ={
    descriptFile : {  //имя обрабатываемого файла
        lineStart : 3,
        lineEnd : 3,
        descriptName : "File",
        structureData : ["Created", "Version"] 
    },
    descriptMachine : {
        lineStart : 4,
        lineEnd : 4,
        descriptName : "Machine",
        structureData : ["MachineSN", "MachineID", "Type"] 
    },
    descriptDeposit : {
        lineStart : 5,
        lineEnd : 5,
        descriptName : "Deposit",
        structureData : [
            "DepositStatus",
            "DepositStartDateTime",
            "DepositEndDateTime",
            "SegmentFlag",
            "PayoutCount",
            "DeclaredAmount",
            "CustomerID",
            "DepositID",
            "Currency",
            "OpModeName",
            "OperatorID",
            "SNImageAvailability"  
        ] 
    },
    descriptBN : {
        lineStart : 6,
        lineEnd : -1, // отрицательное число говорит о неопределенности числа строк блока данных
        descriptName : "BN",
        structureData : [
            "DenomId",
            "Denom",
            "SNID",
            "SNLength",
            "tStart",
            "QualityID",
            "OCID",
            "BNId",
            "SNImageID1",
            "SNImageID2"
        ]
    }
};



//module.exports = {}; 
exports.descriptBpsFile = descriptBpsFile;
