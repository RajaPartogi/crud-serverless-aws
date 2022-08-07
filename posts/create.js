const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
// const { marshall } = require("@aws-sdk/util-dynamodb");
const dynamoDb = require("../config/db");
const { sendResponse } = require("../functions/index");
const { v4 : uuidv4 } = require('uuid');

module.exports.TableNamecreatePost = async (event) => {
    const response = { statusCode: 200 };
    const userId = uuidv4();    

    try {
        const body = JSON.parse(event.body);
        const password = body.password;
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: { 
                userId, 
                ...body, 
                password : md5(password), 
                createdAt : (new Date().toISOString()), 
                updatedAt : "", 
                deletedAt : "" 
            },
            ConditionExpression: "attribute_not_exists(userId)"
        };

        // const createResult = await dynamoDb.send(new PutItemCommand(params));   
        await dynamoDb.put(params).promise(); 

        return sendResponse(response.statusCode, { message: "Successfully Post to Created New User." })

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