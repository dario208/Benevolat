import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { SessionService } from 'src/app/core/services/session.service';
import { AuthModel } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  typeInput!: string;
  checkboxLabel!: string;
  loading!: boolean;
  unauthorized!: boolean;
  responseErreur!: string;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private formbuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessionService.isLoggedIn() && this.router.navigateByUrl('/dashbord');
    
    this.typeInput = 'password';
    this.checkboxLabel = 'afficher';
    this.loading = false;
    this.unauthorized = false;

    this.loginForm = this.formbuilder.group({
      identifiant: [null, [Validators.required]],
      password: [null, Validators.required]
    });
  }

  onShowPassword(event: any): void {
    [this.typeInput, this.checkboxLabel] = event.target.checked 
      ? ['text', 'cacher'] : ['password', 'afficher']
  }

  onSubmit(): void {
    this.loading = true;
    const donnees: AuthModel = this.loginForm.value as AuthModel;
    this.authService.logIn(donnees).pipe(
      tap(response => {
        this.sessionService.setToken(response.access_token);
        this.router.navigateByUrl('/dashbord');
        this.loading = false;
      })
    ).subscribe({
      error: response => {
        this.loading = false;
        this.unauthorized = true;
        if(response.status === 401)
          this.responseErreur = `Identifiant et/ou mot de passe invalides!`;
        else if(response.status === 406)
          this.responseErreur = `Données invalides!`;
        else if(response.status === 0)
          this.responseErreur = `Vous n'êtes pas connecté sur internet!`;
        else
          this.responseErreur = `Une erreur s'est produit...${response.error.message}: ${response.status}`;
      }
    });
  }
}
