import { father } from '../father';
import { HttpStatus } from '@nestjs/common';
import {
   createEventMock,
   createEventWithoutOptionalFieldsMock,
 } from '../../../../mocks/dtos'

export class postEvents extends father {

   constructor() {
      super('POST','/v1/events')
   }

   getPath(){
      return '/v1/events';
   }

   setDataToMock(value:any){
      if (value=='optional'){
         this.dataToMock=createEventWithoutOptionalFieldsMock
      }else if (value=='invalid'){
         const wrongEvent = { ...createEventMock };
         delete wrongEvent.eventName;
         this.dataToMock=wrongEvent
      }else{
         this.dataToMock=createEventMock
      }
   }
   async check_error_response(expected_error_n){
      if (expected_error_n==400){
         console.log(await this.dataToMock)
         console.log(await this.response)
         expect(await this.response.status).toBe(HttpStatus.BAD_REQUEST);
         expect(await this.response.body.errors[0]).toBe('eventName should not be empty');
      }else{
         await super.check_error_response(expected_error_n)
      }
   }
//   mock(eventRepository){
//      jest.spyOn(eventRepository, 'create').mockResolvedValue([createEventMock]);
//   }
}