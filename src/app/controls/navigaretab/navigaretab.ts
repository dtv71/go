import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
    selector: 'navigaretab',
    templateUrl: './navigaretab.html',
})



export class NavigareTab  implements OnInit {
    constructor(private activatedRoute: ActivatedRoute,
        private router: Router) { }

    idCompartiment

    ngOnInit() {
        this.idCompartiment = this.activatedRoute.snapshot.paramMap.get('idCompartiment') || "";
        console.log(this.activatedRoute.url['value'][0].path)
    }
    
    setActive(pagina){
        var classTab = 'nav-link';
        var pag = this.activatedRoute.url['value'][0].path;
        if (pag == pagina) classTab = 'nav-link active';

        return classTab;


    }
}