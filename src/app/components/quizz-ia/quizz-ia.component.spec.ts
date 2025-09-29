import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizzIaComponent } from './quizz-ia.component';

describe('QuizzIaComponent', () => {
  let component: QuizzIaComponent;
  let fixture: ComponentFixture<QuizzIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizzIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
