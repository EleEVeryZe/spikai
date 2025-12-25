import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetTutorComponent } from './alphabet-tutor.component';

describe('AlphabetTutorComponent', () => {
  let component: AlphabetTutorComponent;
  let fixture: ComponentFixture<AlphabetTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphabetTutorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
