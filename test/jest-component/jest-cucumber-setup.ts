
import { loadFeatures, autoBindSteps } from 'jest-cucumber';
import './steps-config'
const { directoryImport } = require('directory-import');
const importedModules = directoryImport('./features/steps/');

let Steps:any=[]
Object.values(importedModules).forEach(file => {
    Object.values(file).forEach(exported => {
        Steps.push(exported)
    })
  });

const features = loadFeatures('test/jest-component/features/*.feature')
autoBindSteps(features, Steps );