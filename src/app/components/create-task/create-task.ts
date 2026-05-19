import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import this

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTaskComponent {

  task = {
    title: '',
    description: '',
    dueDate: ''
  };

  constructor(
    private taskService: TaskService,
    private router: Router,
    private location: Location
  ) {}

  submitTask(): void {
    this.taskService.createTask(this.task).subscribe({
      next: () => {
        alert('✅ Task created successfully');
        this.router.navigateByUrl('/', { replaceUrl: true }); // go back to task list
      },
      error: (err) => {
        console.error('Error creating task', err);
      }
    });
  }

  goBack(): void {
    this.location.back(); 
  }
}
