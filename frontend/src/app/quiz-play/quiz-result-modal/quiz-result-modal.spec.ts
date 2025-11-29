import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultModal } from './quiz-result-modal';

describe('QuizResultModal', () => {
  let component: QuizResultModal;
  let fixture: ComponentFixture<QuizResultModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizResultModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizResultModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
