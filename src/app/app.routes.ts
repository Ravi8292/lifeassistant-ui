import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list';
import { CreateTaskComponent } from './components/create-task/create-task';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'create', component: CreateTaskComponent }
];
