import { Component, Input, OnInit } from "@angular/core";
import { ApiService } from "../_services/api.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../_services/authentication.service";
import { UtilsService } from "../_services/utils.service";
import { AppConfiguration } from "../_services/app-config.service";
import { Accesoriu, Contact, EntMed, Oferta, Prodcat, Produse } from "../_models/_numeris";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { Valuta } from '../_enums/nomenclator';


@Component({
    selector: 'oferta-add',
    templateUrl: 'oferta.add.html',
})

export class OfertaAdd implements OnInit {
    constructor(private api: ApiService, private log: ToastrService, private router: Router, private auth: AuthenticationService,
        private utils: UtilsService, private appconfig: AppConfiguration, private activatedRoute: ActivatedRoute, private http: HttpClient) { }

    @Input() id_prod
    @Input() id_contact
    user
    produs
    contact
    accesorii
    oferta: Oferta

    listavaluta
    listatiptva

    dataOferta
    dataPriority
    dataStatus
    dataReminder
        

    colProduse = [
        { property: "nume_prod", class: "col-8" },
        { property: "numecategorie", class: "col-4" },
    ]
    colCategorii = [
        { property: "nume", class: "col-12" },
    ]
    colContact = [
        { property: "numeprenume", class: "col-4" },
        { property: "loc_contact", class: "col-4" },
        { property: "jud_contact", class: "col-4" },
    ]

    ngOnInit() {
        this.auth.getUserLogat.emit(this.auth.currentUserValue)
        this.user = this.auth.currentUserValue
        this.listavaluta = Valuta

        if (this.id_prod) {
          this.getProdAndAccesorii()
        }
        if (this.id_contact) {
           this.getContact(this.id_contact)
        }

        //this.getTiptva()
        this.ofertaNou()
        this.dataOferta = this.utils.ddateToArr(new Date())
        this.dataPriority = this.utils.ddateToArr(new Date())
        this.dataStatus = this.utils.ddateToArr(new Date())
        this.dataReminder = this.utils.ddateToArr(new Date())


    }

    getContact(id_contact){
        this.api.fdbGetContacte('', id_contact).then((d) => {
            this.contact = d[0]
        })
    }

    getProdAndAccesorii(){
        this.api.fdbGetProduse("", 'idprod', this.id_prod, 1).then((d) => {
            this.produs = d[0]
        })
        this.api.fdbGetAccesoriiForProdus("", this.id_prod).then((d) => {
            this.accesorii = d
        })
    }

    ofertaNou() {
        this.oferta = new Oferta
        this.oferta.id_ofprod = "",
        this.oferta.nume = "",
        this.oferta.id_project = "",
        this.oferta.data_priority = new Date,
        this.oferta.data_status = new Date,
        this.oferta.followup = "",
        this.oferta.pretvanzareof = 0,
        this.oferta.pretftvaof = 0,
        this.oferta.valtvaof = 0,
        this.oferta.procentdiscountof = 0,
        this.oferta.valdiscountof = 0,
        this.oferta.pretoferta = 0,
        this.oferta.modplata = "",
        this.oferta.termen_garantie = "",
        this.oferta.termen_livrare = "",
        this.oferta.instalare = "",
        this.oferta.valabilitate_oferta = "",
        this.oferta.tech_prodof = "",
        this.oferta.optional_prodof = "",
        this.oferta.obsof = "",
        this.oferta.noteof = "",
        this.oferta.data_oferta = new Date,
        this.oferta.id_contact = "",
        this.oferta.data_reminder = new Date,
        this.oferta.data_demo = new Date,
        this.oferta.iduser = "",
        this.oferta.idtip_oferta = "",
        this.oferta.id_valuta = "",
        this.oferta.id_tiptva = "",
        this.oferta.idtip_status = "",
        this.oferta.idtip_prioritate = ""
    }

    listaproduse: any = (search) => {
        return this.api.fdbGetProduse(search, "", this.id_prod || "");
    }

    listacontacte: any = (search) => {
        return this.api.fdbGetContacte(search, this.id_contact || "");
    }

    getTiptva() {
        this.api.getTipTva("", this.oferta.id_tiptva || "").then((d) => {
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
        this.produs.pretvanzare = 1 * this.produs.pretftva + 1 * this.produs.valtva
        this.produs.valdiscount = this.produs.pretvanzare * this.produs.procentdiscount / 100
        this.produs.pretcudiscount = 1 * this.produs.pretvanzare - 1 * this.produs.valdiscount
        console.log(this.produs.valtva)
    }

    isDisabled() {
        return false
    }

    save() {
        // this.produs.id_categorie = this.id_categorie
        // this.apiService.saveInsert(0, this.produs).subscribe((d) => {
        //     this.id_prod = d;
        //     console.log(this.id_prod)
        //     this.log.success('Produs salvat!');
        //     this.goBack()
        // })

    }
    goBack() {
        //this.activeModal.close(this.id_categorie)
    }

}



