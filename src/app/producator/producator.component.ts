import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import { AgGrid } from '../controls/agGrid/agGrid';
import { ColDef } from 'ag-grid-community';
import { ProducatorEditModal } from './producator.edit.modal';

@Component({
  selector: 'app-producator',
  templateUrl: './producator.component.html',
  styleUrl: './producator.component.css'
})
export class ProducatorComponent implements OnInit{
  constructor(private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private auth: AuthenticationService, private dialog: DialogService) { }
  
  id_producator
  grid: AgGrid
  searchText
  listaproducator
  
  ngOnInit(): void {
    this.searchText = ""
    this.id_producator = this.activatedRoute.snapshot.paramMap.get('id_producator') || "";
    this.getProducator()
    this.setupGrid()
  }

  setupGrid(){
    var colDefs: ColDef[] = [
      { headerName: "NrCrt.", valueGetter: "node.rowIndex + 1", width: 70 },
      { headerName: 'Producator', field: 'nume' },
      { headerName: 'Adresa', field: 'adresa' },
      { headerName: 'Telefon', field: 'telefon' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Website', field: 'website' },
      { headerName: 'Localitate', field: 'loc' },
      { headerName: 'Obs', field: 'obs' },
     
    ];
    this.grid = new AgGrid(colDefs, false, false);
    this.grid.onDataLoaded = () => {  }
    this.grid.onRowSelected = () => {
      this.id_producator = this.grid.selectedRow.id_producator;
      this.grid.gridOptions.api.ensureIndexVisible(this.grid.gridOptions.api.getSelectedNodes()[0].rowIndex, null);
      console.log(this.id_producator)
    }
  }

  
  getProducator(){
    const iduser = this.auth.currentUserValue.iduser
    const tipuser = this.auth.currentUserValue.isadmin == 1 ? 'admin' : 'user'
    
    this.api.getProducator(this.searchText, '' ).then((d) => {
      this.listaproducator = d
      //console.log(this.listaentmed)
      this.grid.setDataSource(this.listaproducator).then(() => {
        this.grid.gridOptions.api.forEachNode(node => {
          if (node.data.id_producator == this.id_producator) {
            node.setSelected(true);
          }
        });
      })
    })
  }

  visibleButton() { return true }

  edit(id_producator) {
    this.dialog.custom(ProducatorEditModal, { id_producator: id_producator}, { size: 'lg', backdrop: false }).result.then(() => {
      this.getProducator();
    })
  }
  sterge(id_producator) { }
  exportCsv() { }
  disableButton(tip?) {
    var disabled = true
    switch (tip) {
      case "edit":
      case "sterge":
        if (this.id_producator) { disabled = false; } break;
      default:
        if (this.id_producator) { disabled = false }; break;
    }
  }

}
