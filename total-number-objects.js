"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
const username = "simon.black@mendix.com";
const apikey = "5ffffa03-2779-4e02-8feb-d3cc879108f3";
var projectId;
var projectName;
const revNo = -1; // -1 for latest
const branchName = ``; // null for mainline
const client = new mendixplatformsdk_1.MendixSdkClient(username, apikey);
var json2xls = require('json2xls');
var fs = require('fs');
let jsonXLS = [];
var listOfProjects = [{ 'projectName': 'Customer Portal', 'projectID': 'e4d880a6-9ee5-4f6d-bc77-30dbab20cda7' },
    { 'projectName': 'IoT Logistics', 'projectID': '1b4d254b-b138-4ec4-8f9b-47be490aeff6' },
    { 'projectName': 'Hospital Dashboard', 'projectID': '3cb55799-4166-4a45-935d-ee7087651204' },
    { 'projectName': 'Home Care', 'projectID': '2c48c256-b434-4dd0-abe2-75fc38f97c51' },
    { 'projectName': 'Quote & Buy', 'projectID': '72f620d3-9d67-47df-af1c-2782adedbdec' },
    { 'projectName': 'SAP IoT Logistics', 'projectID': 'ae0c5939-4677-435e-ad71-8c140cbb3b22' },
    { 'projectName': 'SAP Purchase Orders', 'projectID': '999fcfd0-7dcf-40f8-b462-adf6335c133e' },
    { 'projectName': 'Claims Portal', 'projectID': '4047d642-8ab1-4bae-a3e8-acd6fe0c0189' },
    { 'projectName': 'Smart Tasks', 'projectID': 'fbe23c06-8f7d-4d45-a1de-cd350f63fb9b' }];
/*
 * PROJECT TO ANALYZE
 */
const projectsLoading = Promise.all(listOfProjects.map((project) => __awaiter(this, void 0, void 0, function* () {
    yield processProject(project);
}))).then(() => {
    var xls = json2xls(jsonXLS);
    console.log("Writing File");
    fs.writeFileSync('TotalCounts.xlsx', xls, 'binary');
});
function processProject(project) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadProject(project);
    });
}
function loadProject(projectObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = new mendixplatformsdk_1.Project(client, projectObj.projectID, projectObj.projectName);
        const workingCopy = yield client.platform().createOnlineWorkingCopy(project, new mendixplatformsdk_1.Revision(revNo, new mendixplatformsdk_1.Branch(project, branchName)));
        yield getProjectCounts(workingCopy, projectObj.projectName, projectObj.projectID);
    });
}
function getProjectCounts(workingCopy, name, ID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Project: ${name} counting`);
        var NumberEntities = 0;
        var model = workingCopy.model();
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
    });
}
