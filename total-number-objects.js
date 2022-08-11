"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const revNo = -1; // -1 for latest
const branchName = ``; // null for mainline
const client = new mendixplatformsdk_1.MendixPlatformClient();
var json2xls = require('json2xls');
var fs = require('fs');
let jsonXLS = [];
var listOfApps = [{ 'appName': 'Livestock Portal ABP', 'appID': 'c26ee74d-a9db-4bc7-bc19-0d092f7fb4eb' }];
/*
 * PROJECT TO ANALYZE
 */
const projectsLoading = Promise.all(listOfApps.map(async (app) => {
    await processApp(app);
})).then(() => {
    var xls = json2xls(jsonXLS);
    console.log("Writing File");
    fs.writeFileSync('TotalCounts.xlsx', xls, 'binary');
});
async function processApp(app) {
    await loadProject(app);
}
async function loadProject(appObj) {
    const app = client.getApp(appObj.appID);
    const repository = app.getRepository();
    var useBranch = "";
    const repositoryInfo = await repository.getInfo();
    if (repositoryInfo.type === `svn`)
        useBranch = `trunk`;
    else
        useBranch = `main`;
    const wc = await app.createTemporaryWorkingCopy(useBranch);
    await getProjectCounts(wc, appObj.appName, appObj.appID);
}
async function getProjectCounts(workingCopy, name, ID) {
    console.log(`Project: ${name} counting`);
    var NumberEntities = 0;
    var model = await workingCopy.openModel();
    model.allDomainModels().forEach(domainModel => {
        NumberEntities += domainModel.entities.length;
    });
    var jsonObj = {
        "Project Name": name,
        "Project ID": ID,
        "Entities": NumberEntities,
        "Microflows": model.allMicroflows().length,
        "Pages": model.allPages().length,
        "Json Structures": model.allJsonStructures().length,
        "Published OData": model.allPublishedODataServices().length,
        "Published REST": model.allPublishedRestServices().length,
        "Published SOAP": model.allPublishedWebServices().length,
        "Published App Service": model.allPublishedAppServices().length,
        "Export Mappings": model.allExportMappings().length,
        "Imported WebServices": model.allImportedWebServices().length,
        "Imported Mappings": model.allImportMappings().length,
        "XML Schemas": model.allXmlSchemas().length,
        "Documents": model.allDocuments().length,
        "Document Templates": model.allDocumentTemplates().length,
        "Java Actions": model.allJavaActions().length,
        "Snippets": model.allSnippets().length,
        "Navigation Documents": model.allNavigationDocuments().length
    };
    jsonXLS.push(jsonObj);
    console.log(jsonObj);
}
