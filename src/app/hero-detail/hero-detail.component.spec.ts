import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { of } from "rxjs"
import { HeroService } from "../hero.service"
import { HeroDetailComponent } from "./hero-detail.component"

describe('HeroDetail', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute;
  let mockHeroService;
  let mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => { return '3'; }}}
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      imports: [FormsModule],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation}
      ]
    })

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({ id: 3, name: "Gandhi", strength: 4}));
  })

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('GANDHI');
  })

  // 'done' is telling Jasmine to explicitly wait (async) until we call the 'done' ourselves
  it('should call updateHero when saveAsync is called', (done) => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.saveAsync();

    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done();
    }, 300)
  })
})