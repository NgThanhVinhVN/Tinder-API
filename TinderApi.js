const axios = require('axios');
const config = require('./config');
const helper = require('./helper');

let getUser = async () => {
    try {
        let getData = await axios({
            method: 'get',
            url: 'https://api.gotinder.com/v2/recs/core?locale=vi',
            headers: {
                'authority': 'api.gotinder.com',
                'accept': 'application/json',
                'accept-language': 'vi,vi-VN,en-US,en',
                'app-session-id': config["app-session-id"],
                'app-session-time-elapsed': config["app-session-time-elapsed"],
                'app-version': '1032800',
                'origin': 'https://tinder.com',
                'persistent-device-id': config["persistent-device-id"],
                'platform': 'web',
                'referer': 'https://tinder.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'tinder-version': '3.28.0',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
                'user-session-id': config["user-session-id"],
                'user-session-time-elapsed': config["user-session-time-elapsed"],
                'x-auth-token': config["x-auth-token"],
                'x-supported-image-formats': 'webp,jpeg'
            }
        });

        getData = getData.data;

        if (getData.meta.status == 200) {
            if (getData.data.hasOwnProperty("retry_required")) {
                getUser();
                console.log("Retrying Load User....");
            } else {
                let runLike = 1;
                let endLike = Object.keys(getData.data.results).length;

                for (data of getData.data.results) {

                    const execLiker = await like(data.user._id, data.s_number);

                    if (data.user !== undefined) {
                        if (execLiker) {
                            console.log(`Like Success: ${data.user.name}`);
                            helper.saveUserData(`${data.user._id}|${data.s_number}|${data.user.name}`);
                        } else {
                            console.log(`Like Fail: ${data.user.name}`);
                        }
                    }

                    if (runLike == endLike) {
                        getUser();
                    }
                    runLike++;
                }
            }

        } else {
            return false;
        }

    } catch (e) {
        console.log(e);
        getUser();
        return false;
    }
}

let like = async (userID, sNumber) => {
    try {
        var data = JSON.stringify({
            "s_number": sNumber,
            "user_traveling": 1
        });

        let likeData = await axios({
            method: 'post',
            url: `https://api.gotinder.com/like/${userID}?locale=vi`,
            headers: {
                'authority': 'api.gotinder.com',
                'accept': 'application/json',
                'accept-language': 'vi,vi-VN,en-US,en',
                'app-session-id': config["app-session-id"],
                'app-session-time-elapsed': config["app-session-time-elapsed"],
                'app-version': '1032800',
                'content-type': 'application/json',
                'origin': 'https://tinder.com',
                'persistent-device-id': config["persistent-device-id"],
                'platform': 'web',
                'referer': 'https://tinder.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'tinder-version': '3.28.0',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
                'user-session-id': config["user-session-id"],
                'user-session-time-elapsed': config["user-session-time-elapsed"],
                'x-auth-token': config["x-auth-token"],
                'x-supported-image-formats': 'webp,jpeg'
            },
            data: data
        });

        likeData = likeData.data;

        if (likeData.status == 200) {
            return true;
        } else {
            return false;
        }

    } catch (e) {
        console.log(e.message);
        getUser();
        return false;
    }
}

const seenMatch = async (userID) => { // 5e807181e0739401001f589f5ef3b4718a1f1e0100aa96a9
    try {
        var data = JSON.stringify({});

        let likeData = await axios({
            method: 'post',
            url: `https://api.gotinder.com/v2/seen/${userID}?locale=vi`,
            headers: {
                'authority': 'api.gotinder.com',
                'accept': 'application/json',
                'accept-language': 'vi,vi-VN,en-US,en',
                'app-session-id': config["app-session-id"],
                'app-session-time-elapsed': config["app-session-time-elapsed"],
                'app-version': '1032800',
                'content-type': 'application/json',
                'origin': 'https://tinder.com',
                'persistent-device-id': config["persistent-device-id"],
                'platform': 'web',
                'referer': 'https://tinder.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'tinder-version': '3.28.0',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
                'user-session-id': config["user-session-id"],
                'user-session-time-elapsed': config["user-session-time-elapsed"],
                'x-auth-token': config["x-auth-token"],
                'x-supported-image-formats': 'webp,jpeg'
            },
            data: data
        });

        likeData = likeData.data;

        if (likeData.meta.status == 200) {
            return true;
        } else {
            return false;
        }

    } catch (e) {
        console.log(e.message);
        return false;
    }
}

const sendMsg = async (matchId, shortID, name, message) => {
    try {
        var data = JSON.stringify({
            "userId": config["meID"],
            "otherId": shortID,
            "tempMessageId": "0.08481083604217288",
            "matchId": matchId,
            "sessionId": config["user-session-id"],
            "message": message
        });

        let sendData = await axios({
            method: 'post',
            url: 'https://api.gotinder.com/user/matches/' + matchId + '?locale=vi',
            headers: {
                'authority': 'api.gotinder.com',
                'accept': 'application/json',
                'accept-language': 'vi,vi-VN,en-US,en',
                'app-session-id': config["app-session-id"],
                'app-session-time-elapsed': config["app-session-time-elapsed"],
                'app-version': '1032800',
                'content-type': 'application/json',
                'origin': 'https://tinder.com',
                'persistent-device-id': config["persistent-device-id"],
                'platform': 'web',
                'referer': 'https://tinder.com/',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Linux"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'tinder-version': '3.28.0',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
                'user-session-id': config["user-session-id"],
                'user-session-time-elapsed': config["user-session-time-elapsed"],
                'x-auth-token': config["x-auth-token"],
                'x-supported-image-formats': 'webp,jpeg'
            },
            data: data
        });

        sendData = sendData.data;

        if (sendData.hasOwnProperty("_id")) {
            console.log("Send Message To: " + name);
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e.message);
        return false;
    }
}

const getMatch = async (limit) => {
    try {
        let getData = await axios({
            method: 'get',
            url: 'https://api.gotinder.com/v2/matches?locale=vi&count=' + limit + '&message=0&is_tinder_u=false',
            headers: {
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
                'accept-language': 'vi,vi-VN,en-US,en',
                'app-session-time-elapsed': config["app-session-time-elapsed"],
                'X-Auth-Token': config["x-auth-token"],
                'user-session-time-elapsed': config["user-session-time-elapsed"],
                'sec-ch-ua-platform': '"Linux"',
                'x-supported-image-formats': 'webp,jpeg',
                'persistent-device-id': config["persistent-device-id"],
                'tinder-version': '3.28.0',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
                'user-session-id': config["user-session-id"],
                'Accept': 'application/json',
                'Referer': 'https://tinder.com/',
                'platform': 'web',
                'app-session-id': config["app-session-id"],
                'app-version': '1032800'
            }
        });

        getData = getData.data;

        //console.log(getData);

        if (getData.meta.status == 200) {
            if (getData.data.hasOwnProperty("matches")) {
                let runLike = 1;
                let endLike = Object.keys(getData.data.matches).length;

                for (data of getData.data.matches) {
                    if (!data.seen.match_seen) {
                        await seenMatch(data.id);
                        await sendMsg(data.id, data.person._id, data.person.name, config["message"]);
                    }

                    if (runLike == endLike) {
                        getMatch(100);
                    }
                    runLike++;
                }
            }

        } else {
            return false;
        }

    } catch (e) {
        console.log(e);
        getMatch(100);
        return false;
    }
}


module.exports = {
    getUser,
    getMatch
}