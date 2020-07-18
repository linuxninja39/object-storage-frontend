import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {FileListComponent} from './components/file-list/file-list.component';

const routes: Routes = [
  {path: '', component: FileListComponent},
  {path: 'list', component: FileListComponent},
  {path: 'upload', component: FileUploadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
