import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing"
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
  // this works with the live call/set timeout, but also actually makes us wait...
  it('should call updateHero when saveAsync is called (async)', (done) => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.saveAsync();

    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done();
    }, 300)
  })

  // This mocks out the async method so we don't actually have to wait
  it('should call updateHero when saveAsync is called (fakeAsync tick)', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.saveAsync();
    //  tick forces 250ms forward, which exhausts all our async
    tick(250);

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }))

    it('should call updateHero when saveAsync is called (fakeAsync flush)', fakeAsync(() => {
      mockHeroService.updateHero.and.returnValue(of({}));
      fixture.detectChanges();
  
      fixture.componentInstance.saveAsync();
      // flush is like tick(???). It says "however long we have to wait, fast forward til it's over"
      flush();
  
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    }))

    // waitForAsync is good for promises/3rd party APIs, in general opt for the other types
    it('should call updateHero when savePromise is called (waitForAsync)', waitForAsync(() => {
      mockHeroService.updateHero.and.returnValue(of({}));
      fixture.detectChanges();
  
      fixture.componentInstance.savePromise();
  
      // whenStable is a promise that waits for internal promises to complete
      fixture.whenStable().then(() => {
        expect(mockHeroService.updateHero).toHaveBeenCalled();
      })
    }))
})