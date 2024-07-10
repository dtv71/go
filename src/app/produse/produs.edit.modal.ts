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
    id_prod_accesoriu
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
            this.produs.id_categorie = this.id_categorie;
            this.produs.stamp = new Date();
            this.produs.nume_prod = '';
            this.produs.text_prod = '';
            this.produs.is_inactiv = 1
            this.produs.id_tiptva = ''
            this.produs.iduser = this.auth.currentUserValue.iduser
            this.getTiptva()

        } else {
            this.apiService.getElementById("prod_go", "id_prod", this.id_prod, 1).then((d) => {
                this.produs = d[0]
                console.log(this.produs)
                this.getTiptva()
            })
        }
    }

    listacategorii: any = (search) => {
        return this.apiService.fdbGetCategoriiProduse(search, this.id_categorie || "");
    }

    listaproduse: any = (search) => {
        return this.apiService.fdbGetProduse(search, null, this.id_prod_accesoriu || "", ' c.nume ASC ');
    }

    listaproducator: any = (search) => {
        return this.apiService.getProducator(search, this.produs.id_producator || "");
    }

    getTiptva() {
        this.apiService.getTipTva("", this.produs.id_tiptva || "").then((d) => {
            this.listatiptva = d;
        })
    }


    getProduse() {
        this.apiService.fdbGetProduse("", this.id_categorie).then((d) => {
            this.listaproduse = d

        })
    }

    calculpret(){
        
    }

    isDisabled() {
        return false
    }

    save() {
        // this.apiService.saveProdCat(this.prodcat).subscribe((d) => {
        //     this.id_categorie = d;
        //     console.log(this.id_categorie)
        //     this.log.success('Categorie salvata!');
        //     this.goBack()
        // })

    }
    goBack() {
        this.activeModal.close(this.id_categorie)
    }

}



