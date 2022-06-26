/*export */ class CashMachine {
    constructor(id_CashMachine,  MachineSN,  MachineID,  MachineType,  OfficeID,  rec_Created) {
        this.id_CashMachine = id_CashMachine;
        this.MachineSN = MachineSN;
        this.MachineID = MachineID;
        this.MachineType = MachineType;
        this.OfficeID = OfficeID;
        this.rec_Created = rec_Created;
    }
}

module.exports = {
    CashMachine: CashMachine
};

