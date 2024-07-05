import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Injectable, Type } from '@angular/core';
import { ConfirmDialog, DialogType } from '../controls/modal/dialog.confirm';


@Injectable({
  providedIn: 'root'
})
export class DialogService { 

  constructor(private modal: NgbModal) { }

  private openModal(params: any, options?: NgbModalOptions) {
    return this.custom(ConfirmDialog, { params: params }, options)
  }

  custom(component: Type<any>, inputParams?: { [key: string]: any }, options?: NgbModalOptions) {
    var modalRef = this.modal.open(component, options || { animation: true, backdrop: false });
    if (inputParams && modalRef.componentInstance) {
      for (var key in inputParams) {
        modalRef.componentInstance[key] = inputParams[key];
      }
    }
    return modalRef;
  }

  confirm(params:any, options?: NgbModalOptions) {
    params.type || DialogType.info;
    params.confirmBtn = params.hasOwnProperty('confirmBtn') ? params.confirmBtn : true;
    params.cancelBtn = params.hasOwnProperty('cancelBtn') ? params.cancelBtn : true;
    return this.openModal(params, options).result;

  }

  inform(params:any, options?: NgbModalOptions) {
    params.type || DialogType.info;
    params.confirmBtn = params.hasOwnProperty('confirmBtn') ? params.confirmBtn : true;
    return this.openModal(params, options).result;

  }

}