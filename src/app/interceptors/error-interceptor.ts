import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Observable } from 'rxjs';
import { HttpHandler, HttpRequest, HttpInterceptor, HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { FieldMessage } from '../models/fieldmessage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, private router: Router, public alertCtrl: AlertController) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(catchError((error, caught) => {

                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }
                switch (errorObj.status) {

                    case 401:
                        this.handle401();
                        break;

                    case 403:
                        this.handle403();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;

                    default:
                        this.handleDefaultError(errorObj);
                        break;
                }
                throw (error);

            })) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    async handle401() {
        const alert = await this.alertCtrl.create({
            header: 'Erro 401: Falha de autenticação',
            message: 'Credenciais incorretas',
            backdropDismiss: false,
            buttons: [{
                text: 'Ok'
            }]
        });
        await alert.present();
    }

    async handle422(errorObj) {
        let alert = await this.alertCtrl.create(
            {
                header: 'Erro 422: Validação',
                message: this.listErrors(errorObj.errors),
                backdropDismiss: false,
                buttons:
                    [
                        { text: 'Ok' }
                    ]
            }
        );
        await alert.present();
    }

    private listErrors(messages: FieldMessage[]): string {
        let s: string = '';
        for (var i = 0; i < messages.length; i++) {
            s = s + '<p><strong>' + messages[i].fieldName + '</strong>: ' + messages[i].message + '</p>';
        }
        return s;
    }

    async handleDefaultError(errorObj) {
        const alert = await this.alertCtrl.create({
            header: 'Error' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            backdropDismiss: false,
            buttons: [{
                text: 'Ok'
            }]

        });
        await alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};