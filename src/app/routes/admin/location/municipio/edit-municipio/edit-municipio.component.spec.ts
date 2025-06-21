import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMunicipioComponent } from './edit-municipio.component';

describe('EditMunicipioComponent', () => {
  let component: EditMunicipioComponent;
  let fixture: ComponentFixture<EditMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMunicipioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
