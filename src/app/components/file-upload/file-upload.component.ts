import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HistorianService, Logging} from '@natr/historian';
import {ObjectApiService} from '../../service/object-api.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

@Logging
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  private logger: HistorianService;
  private fileToUpload: File;

  fileType: 'pdf' | 'image' | 'mp4';

  error;
  uploadResponse: { status: string, message: string } = {status: null, message: null};
  imagePreview: string;
  pdfPreview: File;
  videoSrc;
  showPreview = false;
  showSpinner = false;
  unsupported = true;
  progress: number = 0;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private objectApiService: ObjectApiService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.form = formBuilder.group(
      {
        file: []
      }
    );
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.fileToUpload) {
      return
    }
    this.logger.debug('file', this.fileToUpload);
    this
      .objectApiService
      .upload(this.fileToUpload)
      .subscribe(
        (b: any) => {
          this.logger.debug('upload b', b);
          switch (b.status) {
            case 'progress':
              this.progress = b.message;
              break;
            case 'complete':
              this.router.navigateByUrl('/list');
              break;
            default:
              this.logger.debug('shouldn\'t be here')
          }
        }
      );
  }

  onFileChange(event) {
    this.showSpinner = true;
    this.showPreview = false;
    this.logger.debug('', event);
    if (event.target.files.length < 1) {
      this.showPreview = false;
      this.showSpinner = false;
    }

    const file = (event.target as HTMLInputElement).files[0];
    this.fileToUpload = file;
    this.logger.debug('file', file);

    // File Preview
    const reader = new FileReader();
    reader.onload = this.readerOnLoad(file);
    reader.onerror = this.readerOnError();
    reader.onloadend = this.readerOnLoadEnd();

    reader.readAsDataURL(file)
  }

  private readerOnLoad(file: File): (this: FileReader, ev: ProgressEvent) => void {
    return (progressEvent: ProgressEvent<FileReader>) => {
      this.logger.debug('onload', progressEvent);
      this.unsupported = false;
      switch (true) {
        case /^image\/.*$/.test(file.type):
          this.fileType = 'image';
          this.logger.debug('its an image', file.type);
          this.imagePreview = progressEvent.target.result as string;
          this.pdfPreview = null;
          break;
        case /^application\/pdf$/.test(file.type):
          this.fileType = 'pdf';
          this.logger.debug('its a pdf file', file.type);
          this.pdfPreview = file;
          this.imagePreview = null;
          break;
        case /^video\/mp4$/.test(file.type):
          this.fileType = 'mp4';
          this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
          break;
        default:
          this.logger.debug('type is', file.type);
          this.unsupported = true;
      }
    }
  }

  private readerOnError(): (this: FileReader, ev: ProgressEvent) => void {
    return (progressEvent: ProgressEvent<FileReader>) => {
      this.logger.debug('error', progressEvent);
    }
  }

  private readerOnLoadEnd(): (this: FileReader, ev: ProgressEvent) => void {
    return (progressEvent: ProgressEvent<FileReader>) => {
      this.logger.debug('on load end', progressEvent);
      this.showSpinner = false;
      this.showPreview = true;
    }
  }
}
