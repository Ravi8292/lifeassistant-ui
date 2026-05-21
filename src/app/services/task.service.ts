import { environment } from '@env';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  //private apiUrl = 'http://localhost:8081/tasks';
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // ✅ GET TASKS
  /*getTasks(): Observable<Page<Task>> {
    return this.http.get<Page<Task>>(this.apiUrl);
  }*/

  /*getTasks(page: number = 0, size: number = 10) {
  return this.http.get<Page<Task>>(
    `${this.apiUrl}?page=${page}&size=${size}&sortBy=id&direction=asc`
  );
}*/
/*getTasks(): Observable<Page<Task>> {
  return this.http.get<Page<Task>>(this.apiUrl);
}*/

getTasks(status: string = 'ALL'): Observable<any> {
  let url = this.apiUrl;
  // If not ALL, add the status as a query parameter
  if (status !== 'ALL') {
    url = `${this.apiUrl}?status=${status}`;
  }
  return this.http.get<any>(url);
}

/*getTasks(): Observable<Page<Task>> {
  return this.http.get<Page<Task>>(
    'http://localhost:8081/tasks?page=0&size=20&sortBy=id&direction=desc'
  );
}*/



  // ✅ MARK AS DONE
  markTaskAsDone(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/done`, {});
  }

  // ✅ CREATE TASK (THIS WAS MISSING)
  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }
  // For delete task
  /*deleteTask(id: number) {
  return this.http.delete(`http://localhost:8081/tasks/${id}`);
}*/

updateTask(task: Task) {
  return this.http.put(`${this.apiUrl}/${task.id}`, task);
}
//search task
searchTasks(keyword: string) {
  return this.http.get<any>(
    `${this.apiUrl}/search?keyword=${keyword}`
  );
}
//ai things task
createTaskWithAI(text: string) {
  return this.http.post(
    `${this.apiUrl}/ai`,
    { text }
  );
}

//upto here
deleteTask(id: number): Observable<string> {
  // We use { responseType: 'text' } because your controller returns a String message
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
}


}
