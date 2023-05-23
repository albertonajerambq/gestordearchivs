import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFilesComponent } from './details-files.component';

describe('DetailsFilesComponent', () => {
  let component: DetailsFilesComponent;
  let fixture: ComponentFixture<DetailsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
