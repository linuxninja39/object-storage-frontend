import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {HistorianService, Logging} from '@natr/historian';

@Logging
@Injectable({
  providedIn: 'root'
})
export class ObjectApiService {
  private logger: HistorianService;

  private SERVER_URL: string = "http://localhost:8000/api";

  constructor(private httpClient: HttpClient) {
  }

  public getFile(fileName: string) {
    return this.httpClient
      .get(`${this.SERVER_URL}/file/${encodeURI(fileName)}`, {responseType: 'blob'});
  }

  public list() {
    return this.httpClient
      .get(`${this.SERVER_URL}/list`);
  }

  public upload(file: File) {
    let uploadURL = `${this.SERVER_URL}/upload`;

    this.logger.debug('file is', file);

    const fd = new FormData();
    fd.append('file', file);

    return this.httpClient
      .post<any>(
        uploadURL,
        fd,
        {
          reportProgress: true,
          observe: 'events'
        }
      )
      .pipe(
        map((event) => {
            this.logger.debug('upload event', event);
            switch (event.type) {
              case HttpEventType.UploadProgress:
                const progress = Math.round(100 * event.loaded / event.total);
                return {status: 'progress', message: progress, event: event};
              case HttpEventType.Response:
                return {status: 'complete', message: 'complete', event: event};
              default:
                return `Unhandled event: ${event.type}`;
            }
          }
        )
      );
  }
}
