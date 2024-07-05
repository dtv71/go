import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { CommonModule } from '@angular/common';
import { AgGrid } from '../controls/agGrid/agGrid';
import { ColDef } from 'ag-grid-community';
import { Grid, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Renderers } from '../controls';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';

@Component({
  selector: 'app-activitate',
  templateUrl: './activitate.component.html',
  styleUrl: './activitate.component.css'
})
export class ActivitateComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthenticationService, private dialog: DialogService) { }

  grid: AgGrid
  gridActivitate: AgGrid
  searchText: string = ''
  listacontacte
  listaactivitate
  id_activitate
  idtip_activitate: string=''
  ord: string = ''
  limit: string = ' 1000 '
  listatipactivitate


  ngOnInit(): void {
    this.id_activitate = this.activatedRoute.snapshot.paramMap.get('id_activitate') || "";
    this.getActivitate()
    this.setupGridActivitate()
    this.getListaTipActivitate()


  }

  setupGridActivitate() {
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Data', field: 'data_activitate', cellRenderer: Renderers.Date, width: 100 },
      { headerName: 'Utilizator', field: 'utilizator' },
      { headerName: 'Activitate', field: 'tipactivitate' },
      { headerName: 'Contact', field: 'numeprenume' },
      { headerName: 'Companie', field: 'companie' },
      { headerName: 'Observatii', field: 'obs' },
      { headerName: 'Followup', field: 'data_followup', cellRenderer: Renderers.Date, width: 100 },
      { headerName: 'Interes', field: 'tipinteres', width: 100 },
      { headerName: 'Eco', field: 'flag_prospect_ecografie', cellRenderer: Renderers.Checkbox, width: 100 },
      { headerName: 'Radio', field: 'flag_prospect_radiologie', cellRenderer: Renderers.Checkbox, width: 100 },
      { headerName: 'ATI', field: 'flag_prospect_ati', cellRenderer: Renderers.Checkbox, width: 100 },
      { headerName: 'Altele', field: 'flag_prospect_altele', cellRenderer: Renderers.Checkbox, width: 100 },
    ];
    this.gridActivitate = new AgGrid(colDefs, false, false);
    this.gridActivitate.onDataLoaded = () => {  }
    this.gridActivitate.onRowSelected = () => { 
      this.id_activitate = this.gridActivitate.selectedRow.id_activitate 
      this.gridActivitate.gridOptions.api.ensureIndexVisible(this.gridActivitate.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
    }
  }

  getActivitate() {
    const iduser = this.auth.currentUserValue.iduser
    const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
    
    this.api.fdbGetActivitate("", this.id_activitate, this.idtip_activitate, iduser, tipuser, this.ord, this.limit ).then((d) => {
      this.listaactivitate = d
      //console.log(this.listaactivitate)
      this.gridActivitate.setDataSource(this.listaactivitate).then(() => {
        this.gridActivitate.gridOptions.api.forEachNode(node => {
          if (node.data.id_activitate == this.id_activitate) {
            node.setSelected(true);
          }
        });
      })
    })
  }

  getListaTipActivitate() {
    this.api.getNomenclatorByTip('', 'tipactivitate', null, 0, 'oldid ASC').then((d) => {
        this.listatipactivitate = d;
        console.log(this.listatipactivitate)
    })
}

  visibleButton() { return true }

  edit(idtip_activitate) {
    this.router.navigate(['./activitate.edit', idtip_activitate || '']);

  }
  sterge() {
      this.dialog.confirm({
      message: 'Doriti sa stergeti activitatea?', confirmBtn: 'Sterge', cancelBtn: 'Renunta'
    }).then(()=>{
      this.api.deleteElementById('activitate_go', 'id_activitate', this.id_activitate, 1 ).subscribe(()=>{
        this.getActivitate()
      })
    })
   }
  exportCsv() { }
  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_activitate) { disabled = false; } break;
      default:
        if (this.id_activitate) { disabled = false }; break;
    }
  }

}
