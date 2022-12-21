import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroComponent } from "./hero.component"

// These are examples of SHALLOW testing

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
      // schemas can... do some stuff. Todo
    })

    fixture = TestBed.createComponent(HeroComponent)
  })

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'Mock Hero', strength: 3};

    expect(fixture.componentInstance.hero.name).toEqual('Mock Hero');
  })

  it('should render the hero name in a tag', () => {
    fixture.componentInstance.hero = { id: 1, name: 'Mock Hero', strength: 3};
    // detect changes is mandatory so that the HTML is rendered
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a').textContent).toContain('Mock Hero');
  })
})