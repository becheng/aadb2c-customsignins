const { TableClient, odata } = require("@azure/data-tables");
const { DefaultAzureCredential } = require("@azure/identity");

module.exports = async function (context, req) {

    console.log(`migrateUserAcct triggered; received request object ${JSON.stringify(req.body)}`);

    const requestObj = req.body;
    const signInName = requestObj.signInName;
    const orgIdInput = requestObj.orgIdInput;
    const password = requestObj.password;
    const useInputPassword = requestObj.useInputPassword;

    const account = process.env.ACCOUNT_NAME;
    const tableName = process.env.TABLE_NAME;
    
    const defaultAzureCredential = new DefaultAzureCredential();
    const tableClient = new TableClient(`https://${account}.table.core.windows.net`, tableName, defaultAzureCredential);

    const entities = tableClient.listEntities({
        queryOptions: { filter: odata`userName eq ${signInName}` }
    });

    const entity = await entities.next();
    const userAcct = entity.value;
    console.log(userAcct);

    let responseObj, httpStatus = 200;
    
    // if no user account, set needToMigrate to false
    if (!userAcct) {

        responseObj = {
            needToMigrate: "false",
            message: `No user account found for userName: ${signInName}`
        }

    // otherwise indicate true with the claims required for user migration        
    } else {
        
        // Compare the password entered by the user and the one in the migration table.
        // Don't compare in password reset flow (useInputPassword is true)
        if (useInputPassword || (password == userAcct.password)) {

            responseObj = {
                needToMigrate: "true",
                newPassword: password,
                displayName: signInName // sets the displayName the same as the username
            } 
            
            // remove the user entity from the migration table
            await tableClient.deleteEntity(userAcct.partitionKey, userAcct.rowKey);
            
        } else {

            httpStatus = 409, // conflict
            responseObj = "Your password is incorrect (migration API)"
        
        }

    }

    context.res = {
        status: httpStatus,
        body: responseObj
    }

    context.done();

}