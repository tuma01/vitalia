import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentosHospitalariosComponent } from './departamentos-hospitalarios.component';

describe('DepartamentosHospitalariosComponent', () => {
  let component: DepartamentosHospitalariosComponent;
  let fixture: ComponentFixture<DepartamentosHospitalariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentosHospitalariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartamentosHospitalariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
