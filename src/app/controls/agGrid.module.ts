import { NgModule, Injector } from "@angular/core";
import { AgGridModule } from 'ag-grid-angular';
import { ModuleRegistry } from "ag-grid-community";

export let GridInjector: Injector;

//import { ModuleRegistry } from '@ag-grid-community/core';
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
//import { CsvExportModule } from "@ag-grid-community/csv-export";


@NgModule({
     imports: [AgGridModule],
     exports: [AgGridModule],
})
export class GridModule {
    constructor(injector: Injector) { GridInjector = injector }
}