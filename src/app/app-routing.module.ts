import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_helpers/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { ContactEdit } from './contact/contact.edit';
import { NomenclatorComponent } from './nomenclator/nomenclator.component';
import { ActivitateComponent } from './activitate/activitate.component';
import { CompanieComponent } from './companie/companie.component';
import { ProducatorComponent } from './producator/producator.component';
import { ActivitateEdit } from './activitate/activitate.edit';
import { ProdcatComponent } from './prodcat/prodcat.component';
import { ProduseComponent } from './produse/produse.component';
import { OfertaComponent } from './oferta/oferta.component';
import { SetarigeneraleComponent } from './setarigenerale/setarigenerale.component';
import { SetaritextComponent } from './setaritext/setaritext.component';
import { UtilizatoriComponent } from './utilizatori/utilizatori.component';
import { OfertaAdd } from './oferta/oferta.add';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'contact.edit/:id_contact', component: ContactEdit, canActivate: [AuthGuard] },
  { path: 'contactnou', component: ContactEdit, canActivate: [AuthGuard] },
  { path: 'nomenclator/:tipstatus', component: NomenclatorComponent, canActivate: [AuthGuard] },
  { path: 'activitate', component: ActivitateComponent, canActivate: [AuthGuard] },
  { path: 'activitate.edit/:idtip_activitate', component: ActivitateEdit, canActivate: [AuthGuard] },
  { path: 'companie', component: CompanieComponent, canActivate: [AuthGuard] },
  { path: 'producator', component: ProducatorComponent, canActivate: [AuthGuard] },
  { path: 'categoriiproduse', component: ProdcatComponent, canActivate: [AuthGuard] },
  { path: 'produse', component: ProduseComponent, canActivate: [AuthGuard] },
  { path: 'setarigenerale/:mod', component: SetarigeneraleComponent, canActivate: [AuthGuard] },
  { path: 'setaritext', component: SetaritextComponent, canActivate: [AuthGuard] },
  { path: 'oferta', component: OfertaComponent, canActivate: [AuthGuard] },
  { path: 'oferta.add/:id_prod/:id_contact', component: OfertaAdd, canActivate: [AuthGuard] },
  { path: 'utilizatori', component: UtilizatoriComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

export const appRoutingModule = RouterModule.forRoot(routes);