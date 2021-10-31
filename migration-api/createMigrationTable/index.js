const { TableClient } = require("@azure/data-tables");
const { DefaultAzureCredential } = require("@azure/identity");

module.exports = async function (context, req) {

    const account = process.env.ACCOUNT_NAME;
    const tableName = process.env.TABLE_NAME;
    
    const defaultAzureCredential = new DefaultAzureCredential();
    const tableClient = new TableClient(`https://${account}.table.core.windows.net`, tableName, defaultAzureCredential);
    
    for (let i = 1; i < 11; i++) {
        await tableClient.createEntity({partitionKey: `P${i}`, rowKey: `R${i}`, userName: `userName${i}`, password: "Password123", firstName: `firstName${i}`, lastName: `lastName${i}`});
    }
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "migrationTbl created successfully!"
    };
}