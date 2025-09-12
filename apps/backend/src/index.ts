import app from "./server";
import { getAppDataSource } from "@repo/db/src/data-source";

const port = process.env.PORT || 3002;

getAppDataSource().then(async (AppDataSource) => {
    console.log('database connected');
    app.listen(port, () => {
        console.log(`app is listening on port ${port}`)
    })
}).catch(err => {
    console.log(err);
})
