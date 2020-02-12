
const aws = require('aws-sdk');
const { AWS_REGION } = require('../config/index');

aws.config.update({ region: AWS_REGION });

// aws.config.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY
// });

class DynamoDBClient {

  /* Usuarios */
  static setUser(user) {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();

      docClient.put({ TableName: 'Users', Item: user }, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static getUsers() {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();

      docClient.scan({ TableName: 'Users' }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  /* Usuarios */

  /* Ponto */
  static createTableReg(year) {
    return new Promise((resolve, reject) => {
      let dynamodb = new aws.DynamoDB();

      let tableName = 'Registers_'+year;
      let table = {
        TableName: tableName,
        AttributeDefinitions: [
          {
            AttributeName: 'userId',
            AttributeType: 'N'
          },{
            AttributeName: 'date',
            AttributeType: 'S'
          }
        ],
        KeySchema: [
          {
            AttributeName: 'userId',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'date',
            KeyType: 'RANGE'
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      };

      dynamodb.createTable(table, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static updateRegs(item) {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();
      let params = {
        TableName: 'Registers',
        Key: {
          userId: item.userId
        },
        UpdateExpression: 'set regs = :regsAtt',
        ExpressionAttributeValues:{
          ':regsAtt':item.regs
        },
        ReturnValues:'UPDATED_NEW'
      };

      docClient.update(params, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static setRegs(item) {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();
      let params = {
        TableName: 'Registers',
        Item: {
          'userId': item.userId,
          'regs': item.regs
        }
      };

      docClient.put(params, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @param {number} userId
   * @param {string} year
   * @param {number} date
   */
  static getReg(userId, year, date) {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();
      let params = {
        TableName: 'Registers_'+year,
        KeyConditionExpression: '#id = :id and #date = :date',
        ExpressionAttributeNames:{
          '#id': 'userId',
          '#date': 'date'
        },
        ExpressionAttributeValues: {
          ':id': userId,
          ':date': date
        }
      };

      docClient.query(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * @param {object} item
   * @param {string} year
   */
  static setReg(item, year) {
    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();
      let params = {
        TableName: 'Registers_'+year,
        Item: item
      };

      docClient.put(params, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  /* Ponto */
}

module.exports = DynamoDBClient;