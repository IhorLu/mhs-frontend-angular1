import { Inject, Injectable } from '@angular/core';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit } from '@jaspero/ng2-confirmations/src/interfaces/resolve-emit';


@Injectable()
export class CustomConfirmationService {
  private options = {
    overlay: true,
    overlayClickToClose: true,
    showCloseButton: true,
    confirmText: 'Yes',
    declineText: 'No'
  };

  constructor(@Inject('$translate') private translateService,
              private _confirmation: ConfirmationService) {
    console.log(this.options);
  }

  public create(text: string): Promise<any> {
    console.log(this.options);
    return new Promise((resolve, reject) => {
      this.translateButtons().then(() => {
        this.translateMessage(text).then((t) => {
          this._confirmation.create('', t, this.options).subscribe((ans: ResolveEmit) => {
            resolve(ans);
          });
        });
      });
    });
  }

  private translateButtons(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.translateMessage('CONFIRMATION_CONFIRM_TEXT').then((text) => {
        this.options.confirmText = text;
      }).then(() => {
        this.translateMessage('CONFIRMATION_DECLINE_TEXT').then((text) => {
          this.options.declineText = text;
          resolve('translated');
        });
      });
    });
  }

  private translateMessage(message) {
    return this.translateService(message);
  }
}
