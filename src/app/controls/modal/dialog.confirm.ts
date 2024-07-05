import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


enum DialogTextAlign { left, rigth }
export enum DialogType {
    primary, secondary, info, warning, succes, error, progress, progressBar
}

export class DialogBtn {
    constructor(public caption: string,
        public icon: string,
        public cssClass: string,
        public action?: 'confirm' | 'delete' | 'cancel' | (() => void),
        public btnType?: 'button' | 'submit' | 'reset') {

        if (!btnType) { this.btnType = 'button' }
    }
}

@Component({
    selector: 'dialog-general',
    templateUrl: './dialog.confirm.html',
})

export class ConfirmDialog implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    btns: DialogBtn[] = [];
    progress = { message: '', procent: 0, autoClose: false };
    get isAutoClose(): boolean { return this.params['autoClose'] }

    @Input() params:any //Dialog.waitParams | Dialog.notifyParams | Dialog.deleteParams | Dialog.confirmParams;

    ngOnInit() {
        console.log(this.params)
        if (this.params['deleteBtn']) { this.btns.push(this.deleteBtn(this.params['deleteBtn'])) }
        if (this.params['confirmBtn']) { this.btns.push(this.confirmBtn(this.params['confirmBtn'])) }
        if (this.params['cancelBtn']) { this.btns.push(this.cancelBtn(this.params['cancelBtn'])) }
    }

    autoClose() { this.close() }
    close(data?: any) { this.activeModal.close(data) }
    cancel(reason?: any) { this.activeModal.dismiss(reason) }
    delete() {
        // if (!this.params['entity']) { this.cancel('No entity provided') }

        // Promise.resolve(this.params['entity']).then(e => {
        //     var entitys = Array.isArray(e) ? e : [e];
        //     entitys.forEach(entity => { entity.entityAspect.setDeleted() });
        //     //this.data.saveChanges(entitys).then(res => this.close(res.entities), (err) => this.cancel(err));
        // })
    }

    onClick(btn: DialogBtn) {
        switch (btn.action) {
            case 'confirm': this.close(); break;
            case 'cancel': this.cancel(); break;
            case 'delete': this.delete(); break;
            default:
                if (typeof btn.action == 'function') { btn.action() }
                break;
        }
    }

    confirmBtn(btn: DialogBtn | boolean | string | any) {
        return new DialogBtn(btn['caption'] || (btn === true ? 'Salvează' : btn),
            btn['icon'] || 'fa-save',
            btn['class'] || 'btn-success',
            'confirm', 'submit')
    }

    deleteBtn(btn: DialogBtn | boolean | string | any) {
        return new DialogBtn(btn['caption'] || (btn == true ? 'Sterge' : btn),
            btn['icon'] || 'fa-trash',
            btn['class'] || 'btn-danger',
            'delete', 'submit')
    }

    cancelBtn(btn: DialogBtn | boolean | string | any) {
        return new DialogBtn(btn['caption'] || (btn === true ? 'Renuntă' : btn),
            btn['icon'] || 'fa-times',
            btn['class'] || 'btn-info',
            'cancel', 'reset')
    }

    textAlign() { return this.getTextAlign(this.params.textAlign) || '' }

    getTextAlign(alignment: string | DialogTextAlign): string | any  {
        switch (alignment) {
            case DialogTextAlign.left: case 'l': case 'left': return 'text-left';
            case DialogTextAlign.rigth: case 'r': case 'rigth': return 'text-right';
        }
    }

    setIcon(isIcon?: boolean) {
        if (isIcon && this.params.icon) { return this.params.icon }
        switch (this.params.type) {
            case "i": case DialogType.info: return isIcon ? "fa-info-circle" : "bg-info";
            case "w": case DialogType.warning: return isIcon ? "fa-exclamation-triangle" : "bg-warning";
            case "s": case DialogType.succes: return isIcon ? "fa-check" : "bg-success";
            case "e": case DialogType.error: return isIcon ? "fa-exclamation-circle" : "bg-danger";
            case "p": case DialogType.primary: return isIcon ? "fa-circle-o" : "bg-primary";
            case "c": case DialogType.secondary: return isIcon ? "fa-circle-o" : "bg-secondary";
            case DialogType.progress: return isIcon ? "fa-spinner fa-spin fa-pulse" : "bg-primary";
            case DialogType.progressBar: return isIcon ? "" : "bg-primary";
            //default: return isIcon ? "fa-circle-o" : "bg-info";
        }
    }
}