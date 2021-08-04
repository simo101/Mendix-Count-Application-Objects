import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch, loadAsPromise } from "mendixplatformsdk";
import { ModelSdkClient, IModel, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus } from "mendixmodelsdk";


import when = require('when');

const username = "{{Username}}";
const apikey = "{{ApiKey}}";
const revNo = -1; // -1 for latest
const branchName = `` // null for mainline
const client = new MendixSdkClient(username, apikey);
var json2xls = require('json2xls');
var fs = require('fs');
let jsonXLS: any[]  = [];

type projectUpload ={"projectName":string, "projectID":string};
var listOfProjects: projectUpload[] =
[{'projectName':'{{ProjectName}}', 'projectID':'{{ProjectId}}'}]

/*
 * PROJECT TO ANALYZE
 */



const projectsLoading = Promise.all(listOfProjects.map(async (project) : Promise<any> => {
        await processProject(project);
})).then(()=>{
        var xls = json2xls(jsonXLS);
        console.log("Writing File")
        fs.writeFileSync('TotalCounts.xlsx', xls, 'binary');
    }); 



async function processProject(project:projectUpload){
    await loadProject(project);
}
   
async function loadProject(projectObj:projectUpload){
    const project = new Project(client, projectObj.projectID, projectObj.projectName);
    const workingCopy = await client.platform().createOnlineWorkingCopy(project,new Revision(revNo, new Branch(project,branchName)));
    await getProjectCounts(workingCopy,projectObj.projectName,projectObj.projectID);
}

async function getProjectCounts(workingCopy:OnlineWorkingCopy,name:String, ID:String){
        console.log(`Project: ${name} counting`)            
        var NumberEntities = 0;
        var model = workingCopy.model();
        model.allDomainModels().forEach(domainModel => {
            NumberEntities+= domainModel.entities.length;
        });
        var jsonObj:any = {
            "Project Name": name, 
            "Project ID": ID, 
            "Entities":NumberEntities,
            "Microflows":model.allMicroflows().length, 
            "Nanoflows":model.allNanoflows().length, 
            "Workflows":model.allWorkflows().length, 
            "Pages": model.allPages().length,            
            "Json Structures": model.allJsonStructures().length,
            "Published OData": model.allPublishedODataServices().length,
            "Published REST": model.allPublishedRestServices().length,
            "Published SOAP": model.allPublishedWebServices().length,
            "Published App Service": model.allPublishedAppServices().length,
            "Export Mappings": model.allExportMappings().length,
            "Imported WebServices": model.allImportedWebServices().length,
            "Imported Mappings":model.allImportMappings().length,
            "XML Schemas": model.allXmlSchemas().length,
            "Documents": model.allDocuments().length,
            "Document Templates": model.allDocumentTemplates().length,
            "Java Actions" : model.allJavaActions().length,
            "JavaScript Actions" : model.allJavaScriptActions().length,
            "Snippets": model.allSnippets().length,
            "Navigation Documents": model.allNavigationDocuments().length    
        };
        jsonXLS.push(jsonObj);
        console.log(jsonObj); 
    
}