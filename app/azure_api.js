// Load libraries
const request = require('request-promise');
const azure = require('azure-storage');

module.exports = {
  /**
   * Uploads a csv text to azure blob storage. For details about the implementation see
   * https://github.com/Azure/azure-storage-node
   * @param {String} csv text with all ideas
   * @return {Promise} Promise will resolve a job
   */
  async uploadIdeasAsCSV(csv) {
    var blobService = azure.createBlobService(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);
    blobService.createContainerIfNotExists(process.env.AZURE_STORAGE_BLOB_CONTAINER, {
      publicAccessLevel: 'blob'
    }, function (error, result, response) {
      if (!error) {
        blobService.createBlockBlobFromText(process.env.AZURE_STORAGE_BLOB_CONTAINER, 'ideas', csv, function (error, result, response) {
          if (!error) {
            return result;
          } else {
            return error;
          }
        });
      } else {
        return error;
      }
    });
  }
};
