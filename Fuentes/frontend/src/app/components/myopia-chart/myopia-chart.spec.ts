import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyopiaChart } from './myopia-chart';

describe('MyopiaChart', () => {
  let component: MyopiaChart;
  let fixture: ComponentFixture<MyopiaChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyopiaChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyopiaChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
