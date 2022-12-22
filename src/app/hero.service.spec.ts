import { TestBed, inject } from "@angular/core/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService', () => {
  let service: HeroService;
  let mockMessageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService}
      ]
    })

    // What is the below saying?
    // The Testbed is looking for any services that use this dependency and will give us a handle
    // controller = TestBed.inject(HttpTestingController);
    // service = TestBed.inject(HeroService);
  })

  describe('getHero', () => {
    // Here is an example of injecting directly. Normally we do it above, but this IS an option
    it('should call with a correctly generated URL', inject(
      [
        HeroService,
        HttpTestingController
      ],
      (
        service: HeroService,
        controller: HttpTestingController
      ) => {

      // this calls the actual function
      service.getHero(4).subscribe(hero => {
        expect(hero.id).toEqual(4);
      });
      // this tells your service what to expect, BUT on its own it only checks for 1 call vs 0, 2, etc.
      // NOTE: this doesn't count as an expectation in Karma even though it checks stuff.
      // use the subscribe block too.
      const request = controller.expectOne('api/heroes/4');

      // this forces a request with the given response
      request.flush({id: 4, name: 'Friend Hero', strength: 8})
      expect(request.request.method).toEqual("GET");
      // this actually verifies that the expectOne above matches in text
      controller.verify();

      expect();
    }))
  })
})