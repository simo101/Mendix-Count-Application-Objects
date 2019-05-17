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
const username = "{[username}}";
const apikey = "{{apikey}}";
var projectId;
var projectName;
const revNo = -1; // -1 for latest
const branchName = ``; // null for mainline
const client = new mendixplatformsdk_1.MendixSdkClient(username, apikey);
var json2xls = require('json2xls');
var fs = require('fs');
let jsonXLS = [];
var listOfProjects = [{ 'projectName': '{{ProjectName}}', 'projectID': '[{ProjectID}]' }];
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
