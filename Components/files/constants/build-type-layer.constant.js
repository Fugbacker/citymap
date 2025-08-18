export const getLayers = (type, id) => {
    switch (type) {
        case 10:
            return { "0": `ID = '${id}'`, "1": "objectid = -1", "2": "objectid = -1", "6": "objectid = -1" };
        case 5:
            return `{"0":"id = '${id}'","1":"id = '${id}'","2":"id = '${id}'","3":"id = '${id}'","4":"id = '${id}'","5":"id = '${id}'"}`;
        default:
            return `{"6":"id = '${id}'","7":"id = '${id}'","8":"id = '${id}'","9":"id = '${id}'"}`;
    }
}