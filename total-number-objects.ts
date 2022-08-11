import { MendixPlatformClient, OnlineWorkingCopy } from "mendixplatformsdk";
import { ModelSdkClient, IModel, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus, Model } from "mendixmodelsdk";


const revNo = -1; // -1 for latest
const branchName = `` // null for mainline
const client = new MendixPlatformClient();
var json2xls = require('json2xls');
var fs = require('fs');
let jsonXLS: any[]  = [];

type appUpload ={"appName":string, "appID":string};
var listOfApps: appUpload[] =
[{'appName':'Livestock Portal ABP', 'appID':'c26ee74d-a9db-4bc7-bc19-0d092f7fb4eb'}]

/*
 * PROJECT TO ANALYZE
 */



const projectsLoading = Promise.all(listOfApps.map(async (app) : Promise<any> => {
        await processApp(app);
})).then(()=>{
        var xls = json2xls(jsonXLS);
        console.log("Writing File")
        fs.writeFileSync('TotalCounts.xlsx', xls, 'binary');
    }); 



async function processApp(app:appUpload){
    await loadProject(app);
}
   
async function loadProject(appObj:appUpload){

    const app = client.getApp(appObj.appID);
    const repository = app.getRepository();
    var useBranch:string ="";

        const repositoryInfo = await repository.getInfo();
        if (repositoryInfo.type === `svn`)
            useBranch = `trunk`;
        else
            useBranch = `main`;

    const wc = await app.createTemporaryWorkingCopy(useBranch);
    await getProjectCounts(wc,appObj.appName,appObj.appID);
}

async function getProjectCounts(workingCopy:OnlineWorkingCopy,name:String, ID:String){
        console.log(`Project: ${name} counting`)            
        var NumberEntities = 0;
        
        var model:IModel = await workingCopy.openModel();
        model.allDomainModels().forEach(domainModel => {
            NumberEntities+= domainModel.entities.length;
        });
        var jsonObj:any = {
            "Project Name": name, 
            "Project ID": ID, 
            "Entities":NumberEntities,
            "Microflows":model.allMicroflows().length, 
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
            "Snippets": model.allSnippets().length,
            "Navigation Documents": model.allNavigationDocuments().length    
        };
        jsonXLS.push(jsonObj);
        console.log(jsonObj); 
    
}