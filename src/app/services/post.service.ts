import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from '../post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointUrl: string = 'https://angular-http-2566c-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postUrl: string = this.endPointUrl + 'post.json';
  errorHandling = new Subject<any>();

  constructor(private http: HttpClient) { }

  //for posting data
  createAndPost(postData: Post) {
    return this.http.post<{name: string}>(this.postUrl, postData, {
      observe: 'response',
      responseType: 'json'
    });
  }

  //for fetching data
  fetchPosts() {
    let customParams = new HttpParams();
    customParams = customParams.append('print', 'pretty');
    customParams = customParams.append('custom-param', 'custom-param-value');
    return this.http.get<{[key: string] : Post}>(this.postUrl, {
      headers: new HttpHeaders({
        'custom-header': 'custom-header-value'
      }),
      params: customParams
    })
    .pipe(
      map(responseData => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({...responseData[key], id: key})
          }
        }
        return postArray;
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  //for deleting data
  deletePosts() {
    return this.http.delete(this.postUrl, {observe: 'events'})
    .pipe(
      tap(
        event => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {

          }
          else if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        }
      )
    );
  }

  //for updating data
  updatePost(postData: Post) {
    const data = {
      [postData.id]: { title: postData.title, content: postData.content }
    };
    return this.http.patch<{name: string}>(this.postUrl, data);
  }
}
