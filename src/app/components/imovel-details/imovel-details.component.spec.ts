import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImovelDetailsComponent } from './imovel-details.component';

describe('ImovelDetailsComponent', () => {
  let component: ImovelDetailsComponent;
  let fixture: ComponentFixture<ImovelDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImovelDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImovelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
