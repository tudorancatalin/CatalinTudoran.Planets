import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table' 
import { PortalModule } from '@angular/cdk/portal';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppNavigationComponent } from './app-navigation/app-navigation.component';
import { ExplorersComponent } from './explorers/explorers.component';
import { AppRouting } from './app.routing';
import { ExplorersService } from './shared/services/explorers.service';
import { ExplorersUpsertComponent } from './explorers-upsert/explorers-upsert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PlanetsComponent } from './planets/planets.component';
import { PlanetsService } from './shared/services/planets.service';
import { PlanetComponent } from './planet/planet.component';
import { PlanetsUpsertComponent } from './planets-upsert/planets-upsert.component';
import { MatSelectModule } from '@angular/material/select';
import { DualListboxComponent } from './dual-listbox/dual-listbox.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './shared/services/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { XHRBackend } from '@angular/http';
import { AuthenticateXHRBackend } from './authenticate-xhr.backend';
import { MessageBoxComponent } from './shared/message-box/message-box.component';
import { DialogService } from './shared/services/dialog.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AppNavigationComponent,
    ExplorersComponent,
    ExplorersUpsertComponent,
    PlanetsComponent,
    PlanetComponent,
    PlanetsUpsertComponent,
    DualListboxComponent,
    LoginComponent,
    ProfileComponent,
    MessageBoxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRouting,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    PortalModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [
    MatInputModule
  ],
  providers: [ExplorersService, PlanetsService, AuthService, DialogService, AuthGuard, {
    provide: XHRBackend,
    useClass: AuthenticateXHRBackend
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
