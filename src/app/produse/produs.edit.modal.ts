import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { EntMed, Prodcat, Produse } from "../_models/_numeris";
import { NgbDate, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { Valuta } from '../_enums/nomenclator';


@Component({
    selector: 'produs-edit-modal',
    templateUrl: 'produs.edit.modal.html',
})

export class ProdusEditModal implements OnInit {
    constructor(public activeModal: NgbActiveModal, private apiService: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_prod
    @Input() id_categorie
    user
    produs: Produse
    id_prod_parent
    listavaluta
    listatiptva

    colProduse = [
        { property: "nume_prod", class: "col-8" },
        { property: "numecategorie", class: "col-4" },
    ]
    colCategorii = [
        { property: "nume", class: "col-12" },
    ]
    colProducator = [
        { property: "nume", class: "col-12" },
    ]


    ngOnInit() {
        this.auth.getUserLogat.emit(this.auth.currentUserValue)
        this.user = this.auth.currentUserValue
        this.listavaluta = Valuta

        if (this.id_prod == '') {
            var d = new Date()
            this.produs = new Produse
            this.produs.id_prod = ""
            this.produs.id_categorie = this.id_categorie;
            this.produs.stamp = new Date();
            this.produs.nume_prod = '';
            this.produs.text_prod = '';
            this.produs.is_inactiv = 1
            this.produs.optional = '';
            this.produs.tech_prod = '';
            this.produs.link_prod = '';
            this.produs.flag_news = 0;
            this.produs.ord = 0;
            this.produs.pretftva = 0;
            this.produs.valtva = 0;
            this.produs.pretvanzare = 0;
            this.produs.valuta = 0;
            this.produs.procentdiscount = 0;
            this.produs.valdiscount = 0;
            this.produs.pretcudiscount = 0;
            this.produs.obs = '';
            this.produs.id_producator = '';
            this.produs.procent_tva_prod = 0;
            this.produs.is_inactiv = 0;
            this.produs.iduser = this.auth.currentUserValue.iduser

            this.getTiptva()

        } else {
            this.apiService.getElementById("prod_go", "id_prod", this.id_prod, 1).then((d) => {
                this.produs = d[0]
                this.id_categorie = this.produs.id_categorie
                console.log(this.produs)
                this.getTiptva()
            })
        }
    }

    listacategorii: any = (search) => {
        return this.apiService.fdbGetCategoriiProduse(search, this.id_categorie || "");
    }

    listaproducator: any = (search) => {
        return this.apiService.getProducator(search, "");
    }

    getTiptva() {
        this.apiService.getTipTva("", this.produs.id_tiptva || "").then((d) => {
            this.listatiptva = d;
        })
    }

    setProcentTva() {
        for (var i = 0; i < this.listatiptva.length; i++) {
            if (this.listatiptva[i].id_tiptva == this.produs.id_tiptva) {
                this.produs.procent_tva_prod = this.listatiptva[i].procent
            }
        }
    }

 
    calculpret() {
        this.setProcentTva()
        this.produs.valtva = this.produs.pretftva * this.produs.procent_tva_prod / 100
        this.produs.pretvanzare = 1*this.produs.pretftva + 1*this.produs.valtva
        this.produs.valdiscount = this.produs.pretvanzare * this.produs.procentdiscount / 100
        this.produs.pretcudiscount = 1* this.produs.pretvanzare - 1*this.produs.valdiscount
        console.log(this.produs.valtva)
    }

    isDisabled() {
        return false
    }

    save() {
        this.produs.id_categorie = this.id_categorie
        this.apiService.saveInsert(0,this.produs).subscribe((d) => {
            this.id_prod = d;
            console.log(this.id_prod)
            this.log.success('Produs salvat!');
            this.goBack()
        })

    }
    goBack() {
        this.activeModal.close(this.id_categorie)
    }

}



