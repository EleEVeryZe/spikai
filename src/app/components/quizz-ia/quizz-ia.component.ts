import { CommonModule } from '@angular/common';
import { Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

/**
 * Interface defining the structure of a single quiz question.
 */
interface Question {
  id: number;
  sentence: string; // The sentence with a blank.
  options: string[]; // The four multiple-choice options.
  correctAnswer: string; // The correct form of the verb.
  tutoringText: string; // The individualized feedback for incorrect answers.
}

/**
 * Interface to store the user's progress on a specific question.
 */
interface QuestionProgress {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  userDoubts: string;
}

// 10 questions focused on the present tense 'Verb To Be' (am, is, are).
const QUIZ_DATA: Question[] = [
  {
    id: 1,
    sentence: "I ___ happy to help you with your homework.",
    options: ["is", "are", "am", "be"],
    correctAnswer: "am",
    tutoringText: "Remember, the first-person singular pronoun 'I' always pairs with the first-person singular form of the verb to be, which is 'am'.",
  },
  {
    id: 2,
    sentence: "They ___ going to the cinema tonight.",
    options: ["is", "am", "are", "was"],
    correctAnswer: "are",
    tutoringText: "For plural subjects like 'They', we use the plural present tense form 'are'. 'Is' is reserved for singular subjects (he, she, it).",
  },
  {
    id: 3,
    sentence: "She ___ a great English teacher.",
    options: ["are", "am", "is", "be"],
    correctAnswer: "is",
    tutoringText: "The subject 'She' is third-person singular, which requires the form 'is'. This is a common rule for he, she, and it.",
  },
  {
    id: 4,
    sentence: "The cat ___ sleeping on the windowsill.",
    options: ["are", "am", "is", "were"],
    correctAnswer: "is",
    tutoringText: "Since 'The cat' is a singular noun (it), the correct verb form is 'is'. Always match the verb to the subject's number (singular/plural).",
  },
  {
    id: 5,
    sentence: "We ___ ready for the next lesson.",
    options: ["is", "am", "are", "been"],
    correctAnswer: "are",
    tutoringText: "As a plural pronoun, 'We' must be paired with the plural verb form 'are'. 'Am' is only for 'I'.",
  },
  {
    id: 6,
    sentence: "You ___ my best friend.",
    options: ["is", "am", "are", "be"],
    correctAnswer: "are",
    tutoringText: "The pronoun 'You' is always treated as plural in the present tense, whether you are referring to one person or many. Therefore, 'are' is the correct choice.",
  },
  {
    id: 7,
    sentence: "It ___ very cold outside today.",
    options: ["are", "am", "is", "be"],
    correctAnswer: "is",
    tutoringText: "The pronoun 'It' is third-person singular, so the corresponding verb form is 'is'.",
  },
  {
    id: 8,
    sentence: "The books ___ on the table.",
    options: ["is", "am", "are", "was"],
    correctAnswer: "are",
    tutoringText: "The subject is 'The books,' which is plural. Plural subjects require the verb form 'are' in the present tense.",
  },
  {
    id: 9,
    sentence: "He ___ at home, studying for his test.",
    options: ["are", "am", "is", "be"],
    correctAnswer: "is",
    tutoringText: "For the third-person singular subject 'He', the correct conjugation of the verb to be is 'is'.",
  },
  {
    id: 10,
    sentence: "My sister and I ___ playing a board game.",
    options: ["is", "am", "are", "be"],
    correctAnswer: "are",
    tutoringText: "When the subject is a compound subject connected by 'and' ('My sister and I'), it is treated as plural, so 'are' is the correct form.",
  },
];

@Component({
  selector: 'app-quizz-ia',
  imports: [
     CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './quizz-ia.component.html',
  styleUrl: './quizz-ia.component.scss'
})
export class QuizzIaComponent {
  quizData = QUIZ_DATA;
  currentQuestionIndex = signal(0);
  
  // State to track progress across all questions
  quizProgress: WritableSignal<QuestionProgress[]> = signal(
    QUIZ_DATA.map(() => ({
      selectedAnswer: null,
      isCorrect: null,
      userDoubts: ''
    }))
  );

  // Gemini State
  isGeminiLoading = signal(false);
  geminiResponse = signal<string | null>(null);

  // Computed signals that depend on the current index
  currentQuestion = computed(() => this.quizData[this.currentQuestionIndex()]);
  currentProgress = computed(() => this.quizProgress()[this.currentQuestionIndex()]);
  
  // Computed display signals derived from currentProgress
  userSelection = computed(() => this.currentProgress().selectedAnswer);
  isCorrect = computed(() => this.currentProgress().isCorrect);
  
  feedbackText = computed(() => {
    const progress = this.currentProgress();
    if (progress.isCorrect === false) {
        // Return the tutoring text for the current question
        return this.currentQuestion()?.tutoringText || 'No tutoring provided.';
    }
    return null;
  });

  // UI status signals
  questionsLeft = computed(() => this.quizData.length - this.currentQuestionIndex());
  isLastQuestion = computed(() => this.currentQuestionIndex() === this.quizData.length - 1);
  
  progressPercent = computed(() => 
    Math.min(100, ((this.currentQuestionIndex() + 1) / this.quizData.length) * 100)
  );


  /**
   * Handles option selection, checks the answer, and updates the progress state.
   * @param event MatRadioChange event containing the selected value.
   */
  selectOption(event: MatRadioChange): void {
       const selectedAnswer = event.value;
      const question = this.currentQuestion();
      if (!question) return;

      const isAnswerCorrect = selectedAnswer === question.correctAnswer;
      const index = this.currentQuestionIndex();
      
      // Update the progress state using a fully immutable approach:
      // 1. Create the updated item.
      // 2. Map the array to create a new array instance, replacing only the item at the current index.
      this.quizProgress.update(progress => {
        const updatedProgressItem: QuestionProgress = {
            ...progress[index],
            selectedAnswer: selectedAnswer,
            isCorrect: isAnswerCorrect,
        };
        // Return a new array instance to guarantee change detection
        return progress.map((item, i) => i === index ? updatedProgressItem : item);
      });

      // Clear Gemini response when a new option is selected
      this.geminiResponse.set(null);
  }
  
  /**
   * Updates the userDoubts text for the current question.
   */
  updateUserDoubts(text: string): void {
    const index = this.currentQuestionIndex();
      
    this.quizProgress.update(progress => {
        const updatedProgressItem: QuestionProgress = progress[this.currentQuestionIndex()] = {
            ...progress[this.currentQuestionIndex()],
            userDoubts: text
        };
                // Return a new array instance to guarantee change detection
        return progress.map((item, i) => i === index ? updatedProgressItem : item);
    });
    // Clear Gemini response if user starts typing again
    this.geminiResponse.set(null);
  }

  /**
   * Advances to the next question.
   */
  nextQuestion(): void {
      if (this.currentQuestionIndex() < this.quizData.length) {
          this.currentQuestionIndex.update(idx => idx + 1);
      }
      this.geminiResponse.set(null);
  }

  /**
   * Goes back to the previous question.
   */
  previousQuestion(): void {
      if (this.currentQuestionIndex() > 0) {
          this.currentQuestionIndex.update(idx => idx - 1);
      }
      this.geminiResponse.set(null);
  }

  /**
   * Calls the Gemini API to clarify the user's doubt.
   */
  async askGemini(): Promise<void> {
    const doubt = this.currentProgress().userDoubts;
    const deepseekAPIKey = "sk-2a4144829a9946fc9d01b0e8be0bf98d";
   
    if (!doubt || this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null); 

    const questionContext = `Pergunta atual: "${this.currentQuestion().sentence.replace('___', this.currentQuestion().correctAnswer)}".`;
    const userQuery = `Minha dúvida com relação a esse ponto específico da gramática inglesa é: "${doubt}"`;

    const systemPrompt = "Você é um tutor extremamente motivado e um profundo conhecedor da gramática inglesa, especializado em Verbo 'TO BE'. Dê uma explicação clara, concisa e útil (abaixo de 100 palavras) que explique a dúvida do usuário sobre a pergunta atual.";
    
    const totalPrompt = `${systemPrompt} | ${questionContext} | ${userQuery}`

    const apiUrl = `https://api.deepseek.com/v1/chat/completions`;

    const payload = 
       {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: totalPrompt,
          },
        ],
        temperature: 0,
        max_tokens: 1000,
      };

    const maxRetries = 5;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {  
                  Authorization: `Bearer ${deepseekAPIKey}`,
                  "Content-Type": "application/json", 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= 2; 
                    continue; 
                }
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, o tutor IA não está disponível no momento. Por favor, confira a conexão de internet ou tente novamente.";
            this.geminiResponse.set(text);
            break; 
            
        } catch (error) {
            if (i === maxRetries - 1) {
                this.geminiResponse.set("Um erro critico ocorreu. Por favor, tente novamente.");
            }
        }
    }
    this.isGeminiLoading.set(false);
  }
}

