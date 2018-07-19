/// <reference path='./typings/tsd.d.ts' />

'use strict';

import { MendixSdkClient, OnlineWorkingCopy, Project, Revision, Branch, loadAsPromise } from "mendixplatformsdk";
import { ModelSdkClient, IModel, Model, projects, domainmodels, microflows, pages, navigation, texts, security, IStructure, menus } from "mendixmodelsdk";


import when = require('when');


const username = "{{Username}}";
const apikey = "{{APIKey}}";
const projectId = "{{ProjectID}}";
const projectName = "{{ProjectName}}";
const revNo = -1; // -1 for latest
const branchName = null // null for mainline
const wc = null;

const client = Model.createSdkClient({
    credentials: {
        username: username,
		apikey: apikey
    }
});
var officegen = require('officegen');
var docx = officegen('docx');
var fs = require('fs');
var pObj;
var totalNumberPages = 0;
var totalNumberMicroflows=0;
var totalNumberEntities = 0;
/*
 * PROJECT TO ANALYZE
 */

const wcParams = {
    name: projectName,
    description: "My MPK app",
    template: "mpk/MPK.mpk"
};

client.createAndOpenWorkingCopy(wcParams,model =>{
        pObj = docx.createP();
        pObj.addText(projectName, { bold: true, underline: true, font_size: 20 });
        pObj.addLineBreak();
        pObj.addLineBreak();
        model.allDomainModels().forEach(domainModel => {
            pObj.addText(getModule(domainModel).name, { bold: true, underline: true, font_size: 18 });
            pObj.addLineBreak();

            totalNumberEntities+= domainModel.entities.length;
            pObj.addText(`Total Entities: ${domainModel.entities.length}`, { bold: false, underline: false, font_size: 15 });
            pObj.addLineBreak();

            var totalPages = model.allPages().filter(page => {
                return getModule(page).name === getModule(domainModel).name;
            });
            totalNumberPages+= totalPages.length;
            pObj.addText(`Total Pages: ${totalPages.length}`, { bold: false, underline: false, font_size: 15 });

            pObj.addLineBreak();
            var microflows = model.allMicroflows().filter(microflow => {
                return getModule(microflow).name === getModule(domainModel).name;
            });
            totalNumberMicroflows+= microflows.length;
            pObj.addText(`Total Microflows: ${microflows.length}`, { bold: false, underline: false, font_size: 15 });
            pObj.addLineBreak();
            pObj.addLineBreak();
            
            return;
        });
        pObj.addText(`Total Stats`, { bold: true, underline: true, font_size: 18 });
        pObj.addLineBreak();
        pObj.addText(`Total Application Objects: ${totalNumberPages+totalNumberEntities+totalNumberMicroflows}`, { bold: false, underline: false, font_size: 15 });
        pObj.addLineBreak();
        pObj.addText(`Total Pages: ${totalNumberPages}`, { bold: false, underline: false, font_size: 15 });
        pObj.addLineBreak();
        pObj.addText(`Total Microflows: ${totalNumberMicroflows}`, { bold: false, underline: false, font_size: 15 });
        pObj.addLineBreak();
        pObj.addText(`Total Entities: ${totalNumberEntities}`, { bold: false, underline: false, font_size: 15 });
        var out = fs.createWriteStream(`${projectName} Application Counts.docx`);
        docx.generate(out);
        out.on('close', function () {
            console.log('Finished to creating Document');
        });
        return;
    },
    error => {
        console.log("Something went wrong:");
        console.dir(error);
    });
    export function getModule(element: IStructure): projects.Module {
        let current = element.unit;
        while (current) {
            if (current instanceof projects.Module) {
                return current;
            }
            current = current.container;
        }
        return null;
    }