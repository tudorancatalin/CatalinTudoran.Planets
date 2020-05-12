import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsUpsertComponent } from './planets-upsert.component';

describe('PlanetsUpsertComponent', () => {
  let component: PlanetsUpsertComponent;
  let fixture: ComponentFixture<PlanetsUpsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetsUpsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetsUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
