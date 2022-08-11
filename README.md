# Mendix Count Application Objects

This script counts all the entities, pages and microflows in each of your modules and compiles a word document report listing them. 

## Setup
To set up and use the sdk you need to have node js installed on your machine. You will need to have also installed typescript.
The following command will install typescript and tsd globally for you:

`npm install -g typescript`

Open up the folder using node.js.
To install the count entities script you should type the command:

`npm install`

This is will install the script and all the relevant dependencies.

To connect it to your apps you need to change the following array in the `total-number-objects.ts`
`[{'appName':'', 'appID':''}]`

## Use the Script
Once the dependencies are installed and the projects updated type:
`tsc`
to compile the script code.

Then after compiling type:
`node script.js`