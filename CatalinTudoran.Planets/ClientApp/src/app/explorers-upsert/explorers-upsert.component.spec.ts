import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorersUpsertComponent } from './explorers-upsert.component';

describe('ExplorersUpsertComponent', () => {
  let component: ExplorersUpsertComponent;
  let fixture: ComponentFixture<ExplorersUpsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorersUpsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorersUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
