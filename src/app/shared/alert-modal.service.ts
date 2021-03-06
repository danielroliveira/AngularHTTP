import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Injectable } from '@angular/core';

export enum alertTypes {
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

  constructor(private modalService: BsModalService) { }

  private showAlert(message: string, type: alertTypes, dismissTimeOut?: number){
    const bsModalRef : BsModalRef = this.modalService.show(AlertModalComponent);
    bsModalRef.content.type = type;
    bsModalRef.content.message = message;

    if(dismissTimeOut){
      setTimeout(() => {
        bsModalRef.hide()
      }, dismissTimeOut);
    }

  }

  showAlertDanger(message: string){
    this.showAlert(message, alertTypes.DANGER)
  }
  
  showAlertSuccess(message: string){
    this.showAlert(message, alertTypes.SUCCESS, 3000)
  }

  showConfirm(title: string, message: string, okTxt?: string, cancelTxt?: string){
    const bsModalRef : BsModalRef = this.modalService.show(ConfirmModalComponent);
    bsModalRef.content.title = title;
    bsModalRef.content.message = message;

    if(okTxt){
      bsModalRef.content.okTxt = okTxt;
    }

    if(cancelTxt){
      bsModalRef.content.cancelTxt = cancelTxt;
    }

    return (<ConfirmModalComponent>bsModalRef.content).confirmResult;
    
  }

}
