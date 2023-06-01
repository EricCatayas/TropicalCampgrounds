require('dotenv').config();
const { BlobServiceClient, StorageSharedKeyCredential} = require("@azure/storage-blob"); // R: https://www.npmjs.com/package/@azure/storage-blob
const { DefaultAzureCredential } = require("@azure/identity");


const {blobServiceClient} = require('../services/azure');
const formidable = require('formidable');
const form = formidable({ multiples: true , uploadDir: 'uploads/'})
const fs = require('fs');

// -> Can upload but don't know how to convert file to img

const travelrecordConnectionstring = process.env.TravelRecordConnectionString
const AccountAccessKey=process.env.AzureAccessKey
const AccountName = "travelrecordapp";
// BlobContainerClient _blobContainerClient = new BlobContainerClient(travelrecordConnectionstring, "photos")
// const blobContainerClient = ContainerClient.fromConnectionString(connectionstring, "campg")
/* create an azure ad application and give this application the permission to access the target azure key vault, then set Environment Variables in the windows server to offer the authentication. Variables should be AZURE_CLIENT_ID, AZURE_TENANT_ID and AZURE_CLIENT_SECRET.*/

// const defaultAzureCredential = new DefaultAzureCredential();  // D: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET in environment vars from registered AAD "Campgrounds";

// const sharedKeyCredential = new StorageSharedKeyCredential(AccountName, AccountAccessKey);

const blobServiceClient = BlobServiceClient.fromConnectionString(travelrecordConnectionstring);
// const blobServiceClient2 = new BlobServiceClient(  Err: authentication is not permitted for non-TLS protected (non-https) URLs
//   travelrecordConnectionstring,
//   defaultAzureCredential
// );

const filepath = "C:\\Users\\ACER\\Desktop\\Conquest\\YelpCamp\\uploads\\d08685f4ae10fdd41358a6600";
const image = await fs.readFileSync(filepath);
const containerName = "campgroundimage";

async function upload() {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    containerClient.get
    const content = image;
    const blobName = "newblob" + new Date().getTime();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}

upload();

module.exports = blobServiceClient;