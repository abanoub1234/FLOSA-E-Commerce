import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { StoreComponent } from './store/store.component';
import { JobComponent } from './job/job.component';
import { CourseComponent } from './course/course.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: AboutPageComponent , pathMatch: 'full'},
  { path: 'about', component: AboutPageComponent },
  { path: 'cart', component: CartComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-product', component: AddProductComponent },  // Add Product Page
  { path: 'profile', component: ProfileComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
  { path: 'store', component: StoreComponent },
  { path: 'job', component: JobComponent },
  { path: 'course', component: CourseComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'chatbot', component: ChatbotComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
