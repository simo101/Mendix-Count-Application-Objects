# Mendix Count Application Objects

This script counts all the entities, pages and microflows in each of your modules and compiles a word document report listing them. 

## Setup
To set up and use the sdk you need to have node js installed on your machine. You will need to have also installed typescript and tsd.
The following command will install typescript and tsd globally for you:

`npm install -g typescript tsd`

Open up the folder using node.js.
To install the count entities script you should type the command:

`npm install`

This is will install the script and all the relevant dependencies.

To connect it to your project you need to change the following constants in the `total-number-objects.ts`

`var username = "{{Username}}";`
This is your email address used to login to Mendix.

`var apikey = "{{ApiKey}}";`
API keys can be found in the mendix home portal.

<img src="./images/CreateAPIKey.gif"/>

`var listOfProjects: projectUpload[] = [{'projectName':'{{ProjectName}}', 'projectID':'{{ProjectId}}'}]`

<img src="./images/GetProjectID.gif"/>

## Use the Script
Once the visualiser is installed type:
`tsc`
to compile the script code.

Then after compiled type:
`node total-number-objects.js`