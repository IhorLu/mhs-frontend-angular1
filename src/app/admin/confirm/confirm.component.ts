import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { Downgrade } from '../../hybrid/downgrade';

export interface ConfirmModel {
  title: string;
  message: string;
}

@Downgrade()
@Component({
  selector: 'mhs-confirm-component',
  templateUrl: './confirm.component.html'
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  confirm() {
    this.result = true;
    this.close();
  }

  cancel() {
    this.result = false;
    this.close();
  }

}
