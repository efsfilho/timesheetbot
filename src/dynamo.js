
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

      let tableName = 'Register_'+year;
      let table = {
        TableName: tableName,
        AttributeDefinitions: [
          {
            AttributeName: 'userId',
            AttributeType: 'N'
          },{
            AttributeName: 'day',
            AttributeType: 'N'
          }
        ],
        KeySchema: [
          {
            AttributeName: 'userId',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'day',
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

  static getDayRegs(id, year, date) {

    let params = {
      TableName: 'Registers_'+year,
      Key: { 'userId': id }
    };

    return new Promise((resolve, reject) => {
      let docClient = new aws.DynamoDB.DocumentClient();

      docClient.get(params, (err, data) => {
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
   * @param {number} id
   * @param {string} year
   * @param {number} date
   */
  static setReg(item, year) {
    return new Promise((resolve, reject) => {

      if (typeof(year) == 'string' && /\d{4}/.test(year)) {

        let docClient = new aws.DynamoDB.DocumentClient();
        let params = {
          TableName: 'Registers_'+year,
          Item: {
            userId: item.userId,
            day: item.day,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0
          }
        };

        docClient.put(params, err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        reject('Erro year');
      }
    });
  }
  /* Ponto */
}

module.exports = DynamoDBClient;