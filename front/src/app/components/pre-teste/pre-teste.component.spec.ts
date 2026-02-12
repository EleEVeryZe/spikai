import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTesteComponent } from './pre-teste.component';

describe('PreTesteComponent', () => {
  let component: PreTesteComponent;
  let fixture: ComponentFixture<PreTesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreTesteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreTesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
