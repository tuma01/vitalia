import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDepartamentoHopitalComponent } from './edit-departamento-hopital.component';

describe('EditDepartamentoHopitalComponent', () => {
  let component: EditDepartamentoHopitalComponent;
  let fixture: ComponentFixture<EditDepartamentoHopitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDepartamentoHopitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDepartamentoHopitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
