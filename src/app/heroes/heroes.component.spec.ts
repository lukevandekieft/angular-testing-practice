import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component"

// These are examples of ISOLATED tests

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroes;
  let mockHeroService: jasmine.SpyObj<HeroService>;

  @Component({
    selector: 'app-hero',
    template: '<div></div>'
  })
  class MockHeroComponent {
    @Input() hero: Hero;
  }

  beforeEach(() => {
    heroes = [
      {id: 1, name: "Nickelback", strength: 2},
      {id: 2, name: "Doctor Strange", strength: 12},
      {id: 3, name: "Spiderman", strength: 9}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
  })

  describe('isolated tests', () => {
    beforeEach(() => {
      component = new HeroesComponent(mockHeroService);
      component.heroes = heroes;
    })

    it('should remove the indicated hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true as any));
      // In above: of(true) throws an error because our type is smart enough to say, hey, that's not what we want!
      // For this particular test we dgaf so "any" overrides the type safety from above
  
      component.delete(heroes[2]);
  
      expect(component.heroes.length).toEqual(2);
    })
  
    it('should call deleteHero when deleting', () => {
      mockHeroService.deleteHero.and.returnValue(of(true as any));
  
      component.delete(heroes[2]);
  
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(heroes[2]);
    })
  })

  describe('shallow tests', () => {
    beforeEach(() => {
      // component allows us to test HeroesComponent in isolation. This one allows for shallow testing
      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          MockHeroComponent
        ],
        providers: [{ provide: HeroService, useValue: mockHeroService}]
      })
      fixture = TestBed.createComponent(HeroesComponent);
    })

    it('should set heroes correctly from the service', () => {
      mockHeroService.getHeroes.and.returnValue(of(heroes));
      fixture.detectChanges(); // <-- unit test fails without! Doesn't know what instance is

      expect(fixture.componentInstance.heroes.length).toEqual(3);
    })

    it('should create one li for each hero', () => {
      mockHeroService.getHeroes.and.returnValue(of(heroes));
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(3);
    })
  })
})