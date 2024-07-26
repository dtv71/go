import { ToastrService } from 'ngx-toastr';
import { Component, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../_services/dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Nomenclator, SpecialitateMedicala, TipTva, Valuta } from '../_models/_numeris';
import { AuthenticationService } from '../_services/authentication.service';
import { TipNomenclator } from '../_enums/nomenclator';



@Component({
    selector: 'setarigenerale-edit',
    templateUrl: './setarigenerale.edit.html',
})

export class SetariGeneraleEdit implements OnInit {
    constructor(public activeModal: NgbActiveModal, private apiService: ApiService,
        private log: ToastrService, private dialog: DialogService, private auth: AuthenticationService
    ) { }

    @Input() id: string;
    @Input() mod: string;


    isNew: boolean = false;
    tiptva: TipTva
    valuta: Valuta
    tipn



    ngOnInit() {
        if (this.mod == 'tiptva') {
            this.getTipTva()
        } else {
            this.getValuta()
        }

    }

    getValuta() {
        if (this.id == '') {
            this.isNew = true;
            this.valuta = new Valuta
            this.valuta.id_valuta = ''
            this.valuta.stamp = new Date;
            this.valuta.nume = ''
            this.valuta.is_curent = 0
            this.valuta.is_inactiv = 0
        } else {
            this.apiService.getElementById('valuta_go', 'id_valuta', this.id, 1).then((d) => {
                this.valuta = d[0];
            })
        }

    }
    getTipTva() {
        if (this.id == '') {
            this.isNew = true;
            this.tiptva = new TipTva
            this.tiptva.id_tiptva = ''
            this.tiptva.stamp = new Date;
            this.tiptva.nume = ''
            this.tiptva.procent = 0
            this.tiptva.is_curent = 0
            this.tiptva.is_inactiv = 0
        } else {
            this.apiService.getElementById('tiptva_go', 'id_tiptva', this.id, 1).then((d) => {
                this.tiptva = d[0];
            })
        }
    }





    isDisabled() {
        var disabled = false
        if (this.mod == 'tiptva') {
            disabled = !this.tiptva.nume && !this.tiptva.procent
        } else {
            disabled = !this.valuta.nume
        }
        return disabled;
    }

    getCssClass(name) {
        return (!name) ? "col-form-label text-danger" : "col-form-label";
    }

    save() {
        console.log(this.mod)
        let data = {}
        let idtabel = 0

        if (this.mod == 'tiptva') {
            data = this.tiptva
            idtabel = 2
        } else {
            data = this.valuta
            idtabel = 3
        }
        this.apiService.saveInsert(idtabel, data).subscribe((d) => {
            this.activeModal.close(d)
        })


    }
    cancel() {
        this.activeModal.dismiss()
    }
}