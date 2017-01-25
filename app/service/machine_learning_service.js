// Load libraries
const azure = require('azure-storage');
const request = require('request-promise');
const jsonexport = require('jsonexport');
const app = require('../../app.js');
const ideas = app.database.get('ideas');

module.exports = {
  /**
   * Upload non evaluated ideas to azure blob storage. See https://github.com/Azure/azure-storage-node for details
   * about azure storage node sdk.
   * @return {Promise} upload promise
   */
  async uploadUnevaluatedIdeasToAzureCloud() {
    var i = await ideas.find({
      evaluation: {
        $exists: true
      }
    });
    i.forEach(idea => {
      idea._id = idea._id.toString();
    });

    /**
     * We have to convert the ideas from JSON to CSV because
     * Azure ML does not support JSON as input for ML.
     */
    return new Promise(function (resolve, reject) {
      jsonexport(i, function (error, csv) {
        if (error) {
          return reject(error);
        } else {
          /**
           * Create a blob from the CSV text and store it in Azure blob storage. The storage container
           * will automatically be created if it does not exist.
           */
          var blobService = azure.createBlobService(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);
          blobService.createContainerIfNotExists(process.env.AZURE_STORAGE_BLOB_CONTAINER, {
            publicAccessLevel: 'blob'
          }, function (error, result, response) {
            if (!error) {
              blobService.createBlockBlobFromText(process.env.AZURE_STORAGE_BLOB_CONTAINER, 'ideas.csv', csv, function (error, result, response) {
                if (!error) {
                  return resolve(response);
                } else {
                  return reject(error);
                }
              });
            } else {
              return reject(error);
            }
          });
        }
      });
    });
  },
  /**
   * Predict the evaluation of a single idea.
   * @param {JSON} idea
   * @return {Promise} Promise will resolve a prediction result
   */
  async predictEvaluationForSingleIdea(idea) {
    return request({
      method: 'POST',
      url: process.env.AZURE_ML_PREDICTION_WEBSERVICE,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AZURE_ML_PREDICTION_WEBSERVICE_KEY
      },
      json: true,
      body: {
        Inputs: {
          input1: [idea]
        },
        GlobalParameters: {}
      }
    });
  }
};
