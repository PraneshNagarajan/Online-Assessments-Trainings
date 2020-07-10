import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { FlexLayoutModule, MediaChange } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { CountdownModule } from 'ngx-countdown';
import { YouTubePlayerModule } from '@angular/youtube-player'
import { SignINUPComponent } from './sign-in-up/sign-in-up.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RouterGuardService } from './router-guard.service';
import { AdminRouterGuardService } from './admin-router-guard.service';
import { DataService } from './data.service';
import { SignupComponent } from './signup/signup.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { TrainingComponent } from './training/training.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ScheduleExamComponent } from './schedule-exam/schedule-exam.component';
import { VideoTutorialComponent } from './video-tutorial/video-tutorial.component';

@NgModule({
  declarations: [
    AppComponent,
    SignINUPComponent,
    HomepageComponent,
    SignupComponent,
    AssessmentComponent,
    TrainingComponent,
    AdminpageComponent,
    ScheduleExamComponent,
    VideoTutorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatToolbarModule,
    MatRadioModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    CountdownModule,
    YouTubePlayerModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot([
      { path: '', component: SignINUPComponent },
      { path: 'signUp', component: SignupComponent },
      { path: 'adminPage', component: AdminpageComponent, canActivate:[AdminRouterGuardService] }, 
      { path: 'homePage', component: HomepageComponent, canActivate:[RouterGuardService] },
      { path: 'scheduleAssessment', component: ScheduleExamComponent, canActivate:[AdminRouterGuardService] },
      { path: 'assessment', component: AssessmentComponent, canActivate:[RouterGuardService] }, 
      { path: 'training', component: TrainingComponent, canActivate:[RouterGuardService] },
      { path: 'video', component: VideoTutorialComponent, canActivate:[RouterGuardService] }
    ])
  ],
  providers: [
    RouterGuardService,
    AdminRouterGuardService,
    DataService,
    MediaChange
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
