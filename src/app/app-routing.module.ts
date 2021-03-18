import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OtherComponent } from './other/other.component';
import { ProfileComponent } from './profile/profile.component';
import { QuizComponent } from './quiz/quiz.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [


  {
    path: 'categories',
    component: CategoriesComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'quiz/:year/:school/:course',
    component: QuizComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'stats',
    component: StatsComponent
  },
  {
    path: 'other/:score/:year/:school/:course',
    component: OtherComponent
  
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
