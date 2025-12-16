# Description
Backend of Esmorga. An app to manage events.

## ✨Installation
First clone de repository:
```bash
$ git clone https://github.com/Esmorga-Backend/esmorga-backend.git
```

Install mongodb and init it:
```bash
https://www.mongodb.com/docs/manual/administration/install-community/
```
And then execute:

```bash
$ npm install
```

## ✨Enviroment Configuration
Create in the project root a file named `.env` and add inside it the environment variables.
> [!IMPORTANT]
> This file and its variables are very important because otherwise the application will not work. Request this information from any contributor to the repository.





Now it's time to configure the code formatting, what is that and what is it for?<br>Basically is the way to maintain consistency of code formatting so that all developers have exactly the same working environment.<br>In order to be able to configure this, there is usually a file in the root of the project known as linter which is responsible for customising the formatting. There are different linters but in this project we use [eslint](https://eslint.org/).<br>In order to get the formatting to work and the warnings to appear in the code you must install this pluggin in vscode https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint.<br>If you want the formatting to be autocorrected when saving, you must type in the vscode search bar `>Preferences:Open User Settings(JSON)` and navigate to the file `settings.json`, then write this inside the {}:
```
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
},
```
## ✨Running the app
Finally we can start the app:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ✨Test
In the `.env` file there's a variable called `AIO_TOKEN` you have to put as value a token generated for your personal use. To generate this token:
1. Go to the [AIO Tests](https://mobilemakers.atlassian.net/projects/MOB?selectedItem=com.atlassian.plugins.atlassian-connect-plugin:com.kaanha.jira.tcms__aio-tcms-project-overview) page. 
2. Click on the ⚙️ icon in the top right corner of the screen.
3. Go to "My Settings".
4. Click on the left menu "API Token" and "Manage API Token".
5. Now copy that token and save it in a safe place to put that value in the .env file at the variable `AIO_TOKEN`.

```bash
# jest test (unit and component)
$ npm run test

# test coverage
$ npm run test:cov

# jest unit test
$ npm run test:unit

# jest component test 
$ npm run test:component

# e2e tests
    #Open 
$ npm run test:e2e-open-cypress
    #Run
$ npm run test:e2e-run-cypress


# ADD a Cycle to the US with all tests from US and all Mareked as Automated 
$ node test/scripts/features-tool --Create-Cycle-for-US

```
## ✨License

Nest is [MIT licensed](LICENSE).


release/esmorga-1.4.0
