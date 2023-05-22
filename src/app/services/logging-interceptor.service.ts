import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, fwd: HttpHandler) {
    console.log(req.url);
    return fwd.handle(req)
    .pipe(
      tap(
        event => {
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        }
      )
    );
  }
}
