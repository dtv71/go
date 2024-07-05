import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ContactComponent } from './contact/contact.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { AppConfiguration } from './_services/app-config.service';
import { DialogService } from './_services/dialog.service';
import { TypeaheadConfigService } from './controls/typeahead/typeahead.config.service';
import { appRoutingModule } from './app-routing.module';
import { GridModule } from './controls/agGrid.module';
import { ContactEdit } from './contact/contact.edit';
import { TypeaheadModule } from './controls/typeahead';
import { NomenclatorComponent } from './nomenclator/nomenclator.component';
import { NomenclatorEdit } from './nomenclator/nomenclator.edit';
import { ConfirmDialog } from './controls/modal/dialog.confirm';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanieComponent } from './companie/companie.component';
import { ActivitateComponent } from './activitate/activitate.component';
import { CompanieEditModal } from './companie/companie.edit.modal';
import { ProducatorComponent } from './producator/producator.component';
import { ProducatorEditModal } from './producator/producator.edit.modal';
import { ActivitateEdit } from './activitate/activitate.edit';
import { ProdcatComponent } from './prodcat/prodcat.component';
import { ProduseComponent } from './produse/produse.component';
import { ProdcatEditModal } from './prodcat/prodcat.edit.modal';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialog,
    DashboardComponent,
    LoginComponent,
    HeaderComponent,
    ContactComponent, ContactEdit, 
    NomenclatorComponent, NomenclatorEdit, 
    ActivitateComponent, ActivitateEdit,
    CompanieComponent, CompanieEditModal, 
    ProducatorComponent, ProducatorEditModal, 
    ProdcatComponent, ProdcatEditModal,
    ProduseComponent
  ],
  imports: [
    BrowserModule,
    appRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    GridModule,
    TypeaheadModule,
    BrowserAnimationsModule
    // FileUploadModule,
    // QRCodeModule,
    // EditorModule
  ],
  providers: [
    AppConfiguration,
    {
      provide: APP_INITIALIZER,
      useFactory: AppConfigurationFactory,
      deps: [AppConfiguration, HttpClient], multi: true
    },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    DialogService,
    TypeaheadConfigService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function AppConfigurationFactory(
  appConfig: AppConfiguration) {
  return () => appConfig.ensureInit();
}
