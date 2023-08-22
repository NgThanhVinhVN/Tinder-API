const helper = require('./helper');

const getData = helper.getDataContent();

const parseLine = getData.split("\n");

const successData = {};

for (var i = 0; i <= parseLine.length - 1; i++) {
    if (parseLine[i] !== "") {
        const userData = parseLine[i].split("|");
        if (!successData.hasOwnProperty(userData[0])) {
            successData[userData[0]] = {
                "s_number": userData[1],
                "name": userData[2]
            }
        }
    }
}

helper.saveJsonUserData(successData);