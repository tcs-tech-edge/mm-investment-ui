import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvLinechartComponent } from './inv-linechart.component';

describe('InvLinechartComponent', () => {
  let component: InvLinechartComponent;
  let fixture: ComponentFixture<InvLinechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvLinechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvLinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
