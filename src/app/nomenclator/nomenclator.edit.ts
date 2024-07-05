import { ToastrService } from 'ngx-toastr';
import { Component, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../_services/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Nomenclator, SpecialitateMedicala } from '../_models/_numeris';
import { AuthenticationService } from '../_services/authentication.service';
import { TipNomenclator } from '../_enums/nomenclator';



@Component({
    selector: 'nomenclator-edit',
    templateUrl: './nomenclator.edit.html',
})

export class NomenclatorEdit implements OnInit {
    constructor(public activeModal: NgbActiveModal, private apiService: ApiService,
        private log: ToastrService, private dialog: DialogService, private auth: AuthenticationService
       ) { }

    @Input() idstatus: string;
    @Input() tipstatus: string;


    isNew: boolean = false;
    status
    tipn



    ngOnInit() {
        this.tipn = TipNomenclator[this.tipstatus]
        if (this.tipstatus == 'specmed') {
            this.getSpecMed()
        } else {
            this.getStatus()
        }

    }
    getStatus() {
        if (this.idstatus == '') {
            this.isNew = true;
            this.status = new Nomenclator
            this.status.idstatus = ''
            this.status.stamp = new Date;
            this.status.iduser = this.auth.currentUserValue.iduser
            this.status.nume = ''
            this.status.color = '#FFFFFF'
            this.status.tipstatus = this.tipstatus
            this.status.lunainceput = 202401;
            this.status.lunasfarsit = 999912;
            this.status.oldid = 0
        } else {
            this.apiService.getElementById('nomenclator_go', 'idstatus', this.idstatus, 1).then((d) => {
                this.status = d[0];
            })
        }
    }



    getSpecMed() {
        if (this.idstatus == '') {
            this.isNew = true;
            this.status = new SpecialitateMedicala
            this.status.idspec_med = ''
            this.status.stamp = new Date;
            this.status.nume = ''
            this.status.lunainceput = 202401;
            this.status.lunasfarsit = 999912;
        } else {
            this.apiService.getElementById('specmed_go', 'idspec_med', this.idstatus, 1).then((d) => {
                this.status = d[0];
            })
        }
    }

    isDisabled() {
        var disabled = false
        if (!this.status.nume) {
            disabled = true
        }
        return disabled;
    }

    getCssClass(name) {
        return (!name) ? "col-form-label text-danger" : "col-form-label";
    }

    save() {
        if (this.tipstatus == 'specmed') {
            this.apiService.saveSpecMed(this.status).subscribe((idnou) => {
                this.activeModal.close(idnou)
            })
        } else {
            this.apiService.saveNomenclator(this.status).subscribe((idnou) => {
                this.activeModal.close(idnou)
            })
        }


    }
    cancel() {
        this.activeModal.dismiss()
    }
}