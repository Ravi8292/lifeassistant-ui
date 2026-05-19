import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 1. Import this
// --- ADD THIS LINE TO HANDLE BROWSER SPEECH API ---
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule], // 🔥 THIS IS MANDATORY
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  isLoading = true
  selectedStatus: string = 'ALL'; // 1. Added for filtering
  // Track if microphone is listening for UI feedback
  isListening = false;
  constructor(private taskService: TaskService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
  }

// --- START VOICE ASSISTANT METHOD ---
  startVoiceAssistant(): void {
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      this.isListening = true;
      this.cdr.detectChanges();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.aiText = transcript; // Auto-fills the textarea
      this.isListening = false;
      this.cdr.detectChanges();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.cdr.detectChanges();
    };

    recognition.onend = () => {
      this.isListening = false;
      this.cdr.detectChanges();
    };

    recognition.start();
  }
  //upto here voice

  // 2. New handler for the dropdown change
  onStatusChange(event: any): void {
    this.selectedStatus = event.target.value;
    console.log('Status changed to:', this.selectedStatus);
    this.loadTasks();
  }
//for search
searchText: string = '';
onSearch(): void {
  if (!this.searchText.trim()) {
    this.loadTasks(); // fallback to normal list
    return;
  }

  this.taskService.searchTasks(this.searchText).subscribe({
    next: (page) => {
      this.tasks = page.content;
    },
    error: err => console.error(err)
  });
}
//for ai task generating 
aiText: string = '';

createTaskWithAI(): void {
  // 1. Check if the field is blank
  if (!this.aiText.trim()) {
    alert("Please write the task for creation");
    return; // Exit function
  }

  // 2. If it is NOT blank, proceed to the service
  // 3. Start Loading
  this.isLoading = true;
  this.taskService.createTaskWithAI(this.aiText).subscribe({
    next: () => {
      alert("Task successfully created!"); // Success message
      this.aiText = '';
      this.loadTasks();
      this.isLoading = false; // Stop Loading
    },
    error: (err) => {
      alert("Error: Could not create task, details are not proper.");
      // this.aiText = '';
      //console.error(err);
      this.isLoading = false; // Stop Loading
      window.location.reload();
      //this.loadTasks();
    }
  });
}

//for voice assistant

//upto here
  /*loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (page) => {
        this.tasks = page.content;
      },
      error: (err) => console.error(err)
    });
  }*/

    /*loadTasks(): void {
  this.taskService.getTasks(0, 20).subscribe({
    next: (page) => {
      this.tasks = page.content;
      console.log('Loaded tasks:', this.tasks);
    },
    error: (err) => {
      console.error('Error loading tasks', err);
    }
  });
}*/

/*loadTasks(): void {
  this.taskService.getTasks().subscribe({
    next: (page) => {
      this.tasks = page.content;
      console.log('Loaded tasks:', this.tasks);
    },
    error: (err) => {
      console.error('Error loading tasks', err);
    }
  });
}*/
/*loadTasks(): void {
  this.taskService.getTasks().subscribe({
    next: (response) => {
      console.log('Full API Response:', response); // Debugging line
      // Use a ternary check to handle both Page objects and simple Arrays
      this.tasks = response && response.content ? response.content : response;
    },
    error: (err) => {
      console.error('API Error on Refresh:', err);
    }
  });
}*/

/*loadTasks(): void {
    this.isLoading = true; // 2. Set to true when starting
    this.taskService.getTasks().subscribe({
      next: (page) => {
        this.tasks = page.content || page; 
        this.isLoading = false; // 3. Set to false when data arrives
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false; 
      }
    });
  }*/

  /*loadTasks(): void {
  this.taskService.getTasks().subscribe({
    next: (data) => {
      // Logic: If data has a 'content' property (Pageable), use it. 
      // Otherwise, assume the data itself is the list.
      this.tasks = data.content ? data.content : data;
      console.log('Successfully loaded tasks:', this.tasks);
    },
    error: (err) => {
      console.error('Refresh Fetch Error:', err);
    }
  });
}*/

loadTasks(): void {
    this.isLoading = true;
    // 3. Passing the selected status to the service
    this.taskService.getTasks(this.selectedStatus).subscribe({
      next: (response: any) => {
        console.log('Processing Backend Response:', response);
        
        if (response && response.content) {
          this.tasks = response.content;
        } else {
          this.tasks = response;
        }

        this.isLoading = false; 
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  markAsDone(id: number): void {
    this.taskService.markTaskAsDone(id).subscribe(() => {
      this.loadTasks(); // refresh after update
    });
  }
//for edit task detils
editingTaskId: number | null = null;
editTask(task: Task): void {
  this.editingTaskId = task.id;
}

cancelEdit(): void {
  this.editingTaskId = null;
}

saveTask(task: Task): void {
  this.taskService.updateTask(task).subscribe({
    next: () => {
      this.editingTaskId = null;
      this.loadTasks();
    },
    error: err => console.error(err)
  });
}

  /*deleteTask(id: number) {
  const confirmDelete = confirm('Are you sure you want to delete this task?');

  if (!confirmDelete) return;

  this.taskService.deleteTask(id).subscribe({
    next: () => {
      console.log('Task deleted');
      this.loadTasks(); // 🔥 refresh list
    },
    error: (err) => {
      console.error('Error deleting task', err);
    }
  });
}*/
deleteTask(id: number): void {
  if (confirm('Are you sure you want to delete this task?')) {
    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        console.log(response); // "Task deleted successfully"
        this.loadTasks(); // Refresh the list from the database
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }
}

}
