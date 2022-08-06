const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const dynamoDb = require("./db");
const { sendResponse } = require("../functions/index");
const { v4 : uuidv4 } = require('uuid');

module.exports.createPost = async (event) => {
    const response = { statusCode: 200 };
    const userId = uuidv4();    

    try {
        const body = JSON.parse(event.body);
        const password = body.password;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall({ userId, ...body, password : md5(password), createdAt : (new Date().toISOString()), updatedAt : "", deletedAt : "" }),
        };

        const createResult = await dynamoDb.send(new PutItemCommand(params));   
        
        return sendResponse(response.statusCode, { message: "Successfully Post to Created New User." , createResult,})

    } catch (e) {
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Post Failed to Create New Users.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
        return sendResponse (response.statusCode, response.body);
    }
    
};