import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component"

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

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

  describe('deep tests', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          HeroComponent,
          RouterLinkDirectiveStub
        ],
        providers: [{ provide: HeroService, useValue: mockHeroService}],
        // schemas: [NO_ERRORS_SCHEMA]
      })
      fixture = TestBed.createComponent(HeroesComponent);
      mockHeroService.getHeroes.and.returnValue(of(heroes));
      fixture.detectChanges();
      // let's just do this here - we want detection on ALL deep tests
    })

    it('should render each hero as a HeroComponent', () => {
      // In Angular a custom component is actually a directive. remember <HeroComponent> isn't real
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

      expect(heroComponents.length).toEqual(3);

      for(let i=0; i < heroComponents.length; i++) {
        expect(heroComponents[i].componentInstance.hero.name).toEqual(heroes[i].name);
      }
    })
    
    // Here we are testing directly through our knowledge of the HTML. Compare to deep test #3
    it(`should call heroService.deleteHero when the Hero Component's
      delete button is clicked (HTML EVENT TRIGGER)`, () => {
        spyOn(fixture.componentInstance, 'delete');

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        heroComponents[0].query(By.css('button'))
          .triggerEventHandler('click', {stopPropagation: () => {}});

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[0]);
    })

    // Here we are actually making the child component emit something, which the parent catches
    it(`should call heroService.deleteHero when the Hero Component's
      delete button is clicked (CHILD EVENT TRIGGER)`, () => {
      spyOn(fixture.componentInstance, 'delete');

      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
      heroComponents[0].componentInstance.delete.emit(undefined);

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[0]);
    })

    // Here we manually triggering an event handler called 'delete'.
    // This is easy and straightforward but keep in mind this will work even if the child lacks 
    // the requisite emitter (e.g. we can call 'fakeEmitter' and it will still work)
    it(`should call heroService.deleteHero when the Hero Component's
    delete button is clicked (MANUAL EVENT TRIGGER)`, () => {
      spyOn(fixture.componentInstance, 'delete');

      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
      heroComponents[0].triggerEventHandler('delete', null);

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(heroes[0]);
    })

    // Tests that input and button click display HTML
    it('should add a new hero to the heroList when the add button is clicked', () => {
      const name = "Mr. Ice";
      mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
      // 'nativeElement' gets us the underlying DOM element rather than the debugElement
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

      inputElement.value = name;
      addButton.triggerEventHandler('click', null);
      // even though we already called detectChanges above, we need to retrigger to show new HTML?
      fixture.detectChanges();
      const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
      expect(heroText).toContain(name);
    })
  })
})