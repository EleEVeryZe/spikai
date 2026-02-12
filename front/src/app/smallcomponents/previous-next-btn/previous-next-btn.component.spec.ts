import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousNextBtnComponent } from './previous-next-btn.component';

describe('PreviousNextBtnComponent', () => {
  let component: PreviousNextBtnComponent;
  let fixture: ComponentFixture<PreviousNextBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousNextBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousNextBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
