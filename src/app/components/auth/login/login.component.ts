import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private router: Router,
    private _CookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this._AuthService.login(formData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this._CookieService.set('token', response.token);
          if (response.token) {
            localStorage.setItem('userName', response.user.username); // Save user name
            localStorage.setItem('userEmail', response.user.email); // Save user email
          }
          this.router.navigate(['/plans']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          // Handle login failure (e.g., show error message)
        },
      });
    }
  }
}