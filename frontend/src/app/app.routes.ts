import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PatientListComponent } from './components/patient-list/patient-list';
import { PatientDetailComponent } from './components/patient-detail/patient-detail';
import { authGuard } from './guards/auth-guard';
import { RevisionFormComponent } from './components/revision-form/revision-form';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'pacientes', component: PatientListComponent, canActivate: [authGuard] },
    { path: 'pacientes/:id', component: PatientDetailComponent, canActivate: [authGuard] },
    { path: 'pacientes/:id/nueva-revision', component: RevisionFormComponent, canActivate: [authGuard] },
    { path: 'pacientes/:id/revision/:revisionId/editar', component: RevisionFormComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];
