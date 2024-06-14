import { futureEventMockDB, oldEventMockDB } from '../../../../mocks/db';
import { father } from '../father';
import { matchers } from 'jest-json-schema';
import { HttpStatus } from '@nestjs/common';

export class getEvents extends father{

   constructor() {
      super('GET','/v1/events')
     
   }

   mock(eventRepository,events_on_db,expired_events_on_db){
      if (expired_events_on_db == 1 && events_on_db == 2 ){
         jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB, oldEventMockDB]);
       }else if (expired_events_on_db == 1 && events_on_db == 1 ){
           jest.spyOn(eventRepository, 'find').mockResolvedValue([oldEventMockDB]);
       }else if (events_on_db == 1){
         jest.spyOn(eventRepository, 'find').mockResolvedValue([futureEventMockDB]);
       }else if (expired_events_on_db != 0 && events_on_db != 0 ){
         expect(false).toBe(true)
       }
   }

   check_content(events_to_check){
      expect(this.response.status).toBe(HttpStatus.OK);
      expect.extend(matchers);
      expect(this.response.body).toMatchObject(
        {"totalEvents": parseInt(events_to_check)}
      )
      if (events_to_check == 1){
          expect(this.response.body).toEqual({
            totalEvents: 1,
            events: [
              {
                eventId: futureEventMockDB._id,
                eventName: futureEventMockDB.eventName,
                eventDate: futureEventMockDB.eventDate.toISOString(),
                description: futureEventMockDB.description,
                eventType: futureEventMockDB.eventType,
                imageUrl: futureEventMockDB.imageUrl,
                location: futureEventMockDB.location,
                tags: futureEventMockDB.tags
              },
            ],
          });
      }else if (events_to_check == 0){
        expect(this.response.body).toEqual({
          totalEvents: 0,
          events: []
        });
      } else {
        expect(false).toBe(true)
      }        
   
   }
   async check_error_response(expected_error_n){
    if (expected_error_n==500){
      expect(await this.response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(await this.response.body).toEqual({
      title: 'internalServerError',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: this.path,
      detail: 'unexpected error',
      errors: ['Internal server error occurred in database operation'],
      });
   }else{
       super.check_error_response(expected_error_n)
    }
 }

}
