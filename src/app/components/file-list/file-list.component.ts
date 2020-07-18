import {Component, OnInit} from '@angular/core';
import {ObjectApiService} from '../../service/object-api.service';
import {HistorianService, Logging} from '@natr/historian';
import {DomSanitizer} from '@angular/platform-browser';

@Logging
@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files;
  logger: HistorianService;
  fileSrc;
  fileType: 'pdf' | 'image' | 'mp4';

  constructor(
    private objectApiService: ObjectApiService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.objectApiService.list().subscribe(
      (response: any) => {
        this.files = response;
      }
    )
  }

  getPreview(fileName: string) {
    console.log('event', fileName);
    this.objectApiService.getFile(fileName)
      .subscribe(
        (fileBlob: Blob) => {
          this.logger.debug('response', fileBlob);
          switch (true) {
            case /^image\/.*$/.test(fileBlob.type):
              this.fileType = 'image';
              this.setImageSrc(fileBlob);
              break;
            case /^application\/pdf$/.test(fileBlob.type):
              this.fileType = 'pdf';
              this.setPdfSrc(fileBlob);
              break;
            case /^video\/mp4$/.test(fileBlob.type):
              this.fileType = 'mp4';
              this.fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(fileBlob));

          }
        }
      );
  }

  private setPdfSrc(pdf: Blob) {
    this.logger.debug('pdf', pdf);
    this.fileSrc = pdf;
  }

  private setImageSrc(image: Blob) {
    let reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        this.fileSrc = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
