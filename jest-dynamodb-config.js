const config = {
  tables: [
    {
      TableName: `client-table-dev`,
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
  ],
  port: 8000,
  options: ["-sharedDb"],
};

module.exports = config;
