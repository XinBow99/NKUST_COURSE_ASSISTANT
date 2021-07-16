import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestschoolLayoutComponent } from './bestschool-layout.component';

describe('BestschoolLayoutComponent', () => {
  let component: BestschoolLayoutComponent;
  let fixture: ComponentFixture<BestschoolLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestschoolLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestschoolLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
