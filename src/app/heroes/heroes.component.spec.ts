import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component"

// These are examples of ISOLATED tests

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let heroes;
  let mockHeroService: jasmine.SpyObj<HeroService>;

  beforeEach(() => {
    heroes = [
      {id: 1, name: "Nickelback", strength: 2},
      {id: 2, name: "Doctor Strange", strength: 12},
      {id: 3, name: "Spiderman", strength: 9}
    ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
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