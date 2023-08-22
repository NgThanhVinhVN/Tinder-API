const tinderApi = require('./src/core/lib/TinderApi');
const helper = require('./src/core/helper/helper');

const run = async () => {
    try {
        // login first
        await tinderApi.loginWithAuthToken();

        setTimeout(async () => {
            await tinderApi.updateLocation(21.0277644, 105.8341598);

            const getData = await tinderApi.getRandomUser();

            if (getData.meta.status == 200) {
                if (getData.data.hasOwnProperty("retry_required")) {
                    run();
                    console.log("Retrying Load User....");
                } else {
                    let runLike = 1;
                    if (getData.data.results) {
                        let endLike = Object.keys(getData.data.results).length;

                        for (data of getData.data.results) {
                            const execLiker = await tinderApi.likeUser(data.user._id, data.s_number);
                            if (data.user !== undefined) {
                                if (execLiker) {
                                    console.log(`Like Success: ${data.user.name}`);
                                    helper.saveUserData(`${data.user._id}|${data.s_number}|${data.user.name}`);
                                } else {
                                    console.log(`Like Fail: ${data.user.name}`);
                                }
                            }

                            if (runLike == endLike) {
                                run();
                            }
                            runLike++;
                        }
                    } else {
                        run();
                    }
                }
            } else {
                // recall;
                run();
            }
        }, 2000)
    } catch (err) {
        run(100);
    }
}

const matchedAction = async (limit) => {
    try {
        // login first
        await tinderApi.loginWithAuthToken();

        setTimeout(async () => {
            const config = helper.getConfig('auth');
            const getData = await tinderApi.getMatched(100);

            if (getData.meta.status == 200) {

                if (getData.data.hasOwnProperty("matches")) {

                    if (getData.data.matches) {

                        for (data of getData.data.matches) {

                            console.log(data);


                            // chưa seen mactch
                            if (!data.seen.match_seen) {
                                if (void 0 !== data.person) {
                                    if (void 0 !== data.person._id) {
                                        await tinderApi.seenMatch(data.id);
                                        await tinderApi.sendMessage(data.id, data.person._id, data.person.name, config["message"]);
                                        console.log("Send Messsage to: " + data.person.name);
                                    }
                                }
                            } else {
                                if (void 0 !== data.person) {
                                    if (void 0 !== data.person._id) {
                                        await tinderApi.seenMatch(data.id);
                                        await tinderApi.sendMessage(data.id, data.person._id, data.person.name, config["message"]);
                                        console.log("Send Messsage to: " + data.person.name);
                                    }
                                }
                            }
                        }

                        matchedAction(100);
                    } else {
                        matchedAction(100);
                    }
                }
            } else {
                matchedAction(100);
            }
        }, 2000)
    } catch (err) {
        matchedAction(100);
    }
}

matchedAction(100);
run();