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
import { AuthService } from './auth.service';
import { SignupComponent } from './signup/signup.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { VideoTutorialComponent } from './video-tutorial/video-tutorial.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { FilterPipe } from './filter.pipe';
import { NotificationComponent } from './notification/notification.component';
import { AddAssessmentComponent } from './add-assessment/add-assessment.component';
import { ScheduleAssessmentComponent } from './schedule-assessment/schedule-assessment.component';
import { ManageAssessmentsComponent } from './manage-assessments/manage-assessments.component';
import { ProfileComponent } from './profile/profile.component';
import { ResultsComponent } from './results/results.component';
import { AddVideosComponent } from './add-videos/add-videos.component';
import { ManageVideosComponent } from './manage-videos/manage-videos.component';
import { InvalidPageComponent } from './invalid-page/invalid-page.component';
import { CatagoryComponent } from './catagory/catagory.component';

@NgModule({
  declarations: [
    AppComponent,
    SignINUPComponent,
    HomepageComponent,
    SignupComponent,
    AssessmentComponent,
    AdminpageComponent,
    VideoTutorialComponent,
    FilterPipe,
    NotificationComponent,
    AddAssessmentComponent,
    ManageAssessmentsComponent,
    ScheduleAssessmentComponent,
    ProfileComponent,
    ResultsComponent,
    AddVideosComponent,
    ManageVideosComponent,
    InvalidPageComponent,
    CatagoryComponent
  ],
  imports: [
    MatGridListModule,
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
    MatDividerModule,
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
      { path: 'assessment', component: AssessmentComponent, canActivate:[RouterGuardService] }, 
      { path: 'addAssessments', component: AddAssessmentComponent, canActivate:[AdminRouterGuardService] },
      { path: 'scheduleAssessments', component: ScheduleAssessmentComponent, canActivate:[AdminRouterGuardService] },
      { path: 'manageAssessments', component: ManageAssessmentsComponent, canActivate:[AdminRouterGuardService] },
      { path: 'notifications', component: NotificationComponent, canActivate:[RouterGuardService] },
      { path: 'profile', component: ProfileComponent, canActivate:[RouterGuardService] },
      { path: 'results', component: ResultsComponent, canActivate:[RouterGuardService] },
      { path: 'videos', component: VideoTutorialComponent, canActivate:[RouterGuardService] },
      { path: 'addVideos', component: AddVideosComponent, canActivate:[AdminRouterGuardService] },
      { path: 'manageVideos', component: ManageVideosComponent, canActivate:[AdminRouterGuardService] },
      { path: 'catagory', component: CatagoryComponent, canActivate:[AdminRouterGuardService] },
      { path: '**', component: InvalidPageComponent}
    ])
  ],
  providers: [
    RouterGuardService,
    AdminRouterGuardService,
    DataService,
    AuthService,
    MediaChange
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
