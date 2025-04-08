import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Food {
  value: string;
  viewValue: string;
}

interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-material-components-demo',
  templateUrl: './material-components-demo.component.html',
  styleUrls: ['./material-components-demo.component.scss'],
  standalone: false
})
export class MaterialComponentsDemoComponent implements OnInit {
  // Form controls
  demoForm: FormGroup = new FormGroup({});

  // For mat-select
  foods: Food[] = [
    { value: 'steak', viewValue: 'Steak' },
    { value: 'pizza', viewValue: 'Pizza' },
    { value: 'tacos', viewValue: 'Tacos' },
    { value: 'sushi', viewValue: 'Sushi' },
    { value: 'salad', viewValue: 'Salad' }
  ];

  // For mat-datepicker
  startDate = new Date();

  // For mat-slider
  sliderValue = 40;

  // For mat-checkbox
  task: Task = {
    name: 'All features',
    completed: false,
    subtasks: [
      { name: 'Forms', completed: false },
      { name: 'Navigation', completed: false },
      { name: 'Data Display', completed: false },
      { name: 'Feedback', completed: false }
    ]
  };
  allComplete = false;

  // For mat-radio
  favoriteFruit: string = 'apple';

  // For mat-tabs
  selectedTabIndex = 0;

  // For mat-button-toggle
  fontStyle: string | undefined;

  // Expansion panel
  panelOpenState = false;

  // For dialog demo
  animal: string | undefined;
  name: string | undefined;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: [''],
      favoriteFood: [''],
      date: [new Date()],
      slidingValue: [40],
      enableNotifications: [true]
    });
  }

  // Methods for interactive components
  submitForm(): void {
    if (this.demoForm?.valid) {
      this.snackBar.open('Form submitted successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } else {
      this.snackBar.open('Please fill out all required fields correctly', 'OK', {
        duration: 3000,
        panelClass: 'error-snackbar'
      });
    }
  }

  updateAllComplete(): void {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every((t) => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter((t) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach((t) => (t.completed = completed));
  }

  announceTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  showProgressSpinner(): void {
    // Demo method for a spinner with loading state
  }
}
