require('module-alias/register');
require('dotenv').config();
// load config env
const config = require('@Config');
// load express handle
const app = require('@App');

const server = app.listen(config.PORT, () => {
    console.log(
        ">>> Server is running at port %d in %s mode",
        config.PORT,
        config.ENV_ENVIROMENT
    );
    console.log(">>> Press CTRL-C to stop server\n");
});
