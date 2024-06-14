import { father } from '../../support/father';
import { HttpStatus } from '@nestjs/common';
import {
   createEventMock,
   createEventWithoutOptionalFieldsMock,
 } from '../../../../mocks/dtos'
import { app, eventRepository, schema, context } from '../../../steps-config'

export class postEvents extends father {
   constructor(){
      super()
   }

   setDataToMock(value:any){
      if (value=='optional'){
         context.dataToMock=createEventWithoutOptionalFieldsMock
      }else if (value=='invalid'){
         const wrongEvent = { ...createEventMock };
         delete wrongEvent.eventName;
         context.dataToMock=wrongEvent
      }else{
         context.dataToMock=createEventMock
      }
   }
   check_error_response(expected_error_n){
      if (expected_error_n==400){
         console.log(context.dataToMock)
         console.log(context.response)
         expect(context.response.status).toBe(HttpStatus.BAD_REQUEST);
         expect(context.response.body.errors[0]).toBe('eventName should not be empty');
      }else{
         super.check_error_response(expected_error_n)
      }
   }
//   mock(eventRepository){
//      jest.spyOn(eventRepository, 'create').mockResolvedValue([createEventMock]);
//   }
}