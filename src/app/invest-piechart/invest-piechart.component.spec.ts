import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestPiechartComponent } from './invest-piechart.component';

describe('InvestPiechartComponent', () => {
  let component: InvestPiechartComponent;
  let fixture: ComponentFixture<InvestPiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestPiechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
