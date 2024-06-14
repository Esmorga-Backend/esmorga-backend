import * as request from 'supertest';
import { HttpStatus } from '@nestjs/common';
const Ajv = require('ajv')
const addFormats = require('ajv-formats');
const ajv = new Ajv({ strict: false });
addFormats(ajv)


export class father {
   path: string;
   requestType: string;
   response:any
   headers:any
   dataToMock:any

   constructor(requestType:string,path:string) {
      this.path=path
      this.requestType=requestType
      this.headers = {
         'Content-Type': 'application/json',
       };
      
   }

   getPath(){
      return this.path;
   }

   getRequestType(){
      return this.requestType;
   }



   async makeRequest(app){
      if (this.requestType == "GET") {
         this.response= await request(app.getHttpServer()).get(this.path).set(this.headers);
      }else if (this.requestType == "POST") {
         this.response= await request(app.getHttpServer())
         .post(this.path)
         .set(this.headers)
         .send(this.dataToMock);
      }
   }

   check_with_swagger(schema){
      const reference = schema.paths[this.path].get.responses[this.response.status].content['application/json'].schema
      const validate = ajv.compile(reference);
      const valid = validate(this.response.body);
      if (!valid) {
      console.error(validate.errors);
      }
      expect(valid).toBe(true);
   }

   async check_error_response(expected_error_n){
      if (expected_error_n==500){
         expect(await this.response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }else if (await expected_error_n==400){
         expect(this.response.status).toBe(HttpStatus.BAD_REQUEST);
      }else{
         expect(true).toBe(false);
      }
   }
   check_success_response(success_n){
      if (success_n==201){
         expect(this.response.status).toBe(HttpStatus.CREATED);
         expect(this.response.body).toEqual({});
      }else{
         expect(true).toBe(false);
      }
   }
}