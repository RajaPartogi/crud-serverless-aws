const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient(clientParams);

const params = {
    TableName: "Table",
    Item: marshall({
      HashKey: "hashKey",
      NumAttribute: 1,
      BoolAttribute: true,
      ListAttribute: [1, "two", false],
      MapAttribute: { foo: "bar" },
      NullAttribute: null,
    }),
  };
  
  await client.putItem(params);