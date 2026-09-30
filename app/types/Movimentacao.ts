export interface Movimentacao {
    id?: number;
    tipo: string;
    dataHora: Date;
    patrimonioId: number;
    salaId: number;
}