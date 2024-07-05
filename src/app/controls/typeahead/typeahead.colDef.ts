export const colParteneri2Row = [
    { property: 'nume', class: 'col-9' },
    { property: 'tipEntitate', class: 'col-3' },
    { property: 'cif', class: 'offset-sm-9 col-3' },
];
export const colParteneri1Row = [
    { property: 'cif', class: 'col-3' },
    { property: 'tipEntitate', class: 'col-2' },
    { property: 'nume', class: 'col' },
];
export const colParteneri = [
    {
        property: 'nume', class: 'col-8',
        prepend: (item) => item.isTvaIncasare ? '<i title="Partenerul aplica tva la incasare" class="fal fa-exclamation-circle text-warning"></i>' : ''
    },
    { property: 'cif', class: 'col-4' },
    { property: 'tipEntitate', class: 'offset-sm-8 col-4' },
];
export const colProduse = [
    { property: 'cod', class: 'col-2' },
    { property: 'nume', class: 'col-5' },
    { property: 'um', class: 'col-1' },
    { property: 'continut', class: 'col-4' },
];
export const colProduseExtins = [
    { property: 'cod', class: 'col-2' },
    { property: 'nume', class: 'col-5' },
    { property: 'um', class: 'col-1' },
    { property: 'continut', class: 'col-3' },
    { property: 'continutEconomic', class: 'col-1' },
];