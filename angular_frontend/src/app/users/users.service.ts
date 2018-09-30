

import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

export interface User {
  _id?: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private serviceUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(_id: string): Observable<User> {
    return this.http.get<User>(this.serviceUrl + '/'+ _id).pipe(
      catchError(this.handleError)
    );
  }

  insertUser(body: User): Observable<User> {
    return this.http.post<User>(this.serviceUrl, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(body: User): Observable<User> {
    return this.http.put<User>(this.serviceUrl + '/' + body._id, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(_id: string): Observable<String> {
    return this.http.delete<String>(this.serviceUrl + '/' + _id).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}