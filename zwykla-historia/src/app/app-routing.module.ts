import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CharacterCardComponent } from './character-card/character-card.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
    // loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {path: 'ermin', component: CharacterCardComponent},
  {path: 'lokkri', component: CharacterCardComponent},
  {path: 'gustav', component: CharacterCardComponent},
  {path: 'verbena', component: CharacterCardComponent},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
