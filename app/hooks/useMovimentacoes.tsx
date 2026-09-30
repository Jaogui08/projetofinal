'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Movimentacao } from '@/app/types/Movimentacao';
import Swal from 'sweetalert2';

export function useMovimentacoes() {
    const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
    const [loading, setLoading] = useState(false);

    const extrairErro = (error: any, mensagemPadrao: string) => {
        const data = error.response?.data;

        if (data) {
            if (data.erro) return String(data.erro);
            if (data.message) return String(data.message);
            if (data.error) return String(data.error);
        }

        return error.message || mensagemPadrao;
    };

    const listarMovimentacoes = useCallback(async () => {
        setLoading(true);

        try {
            const resposta = await api.get('/movimentacao');
            setMovimentacoes(resposta.data);
        } catch (error: any) {
            Swal.fire({
                title: 'Erro!',
                text: extrairErro(error, "Erro ao buscar movimentações"),
                icon: 'error',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d", 
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const excluir = async (id: number) => {
        const confirmacao = await Swal.fire({
            title: 'Excluir movimentação?',
            text: "Esta ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            color: "#e6e6e6",
            confirmButtonColor: '#ca0101',
            background: "#211d1d",
        });

        if (confirmacao.isConfirmed) {
            try {
                await api.delete(`/movimentacao/${id}`);

                Swal.fire(
                    'Excluída!',
                    'A movimentação foi removida.',
                    'success'
                );

                listarMovimentacoes();

            } catch (error: any) {
                Swal.fire({
                    title: 'Erro!',
                    text: extrairErro(error, "Erro ao excluir"),
                    icon: 'error',
                    color: "#e6e6e6",
                    confirmButtonColor: '#ca0101',
                    background: "#211d1d",
                });
            }
        }
    };

    return {
        movimentacoes,
        loading,
        listarMovimentacoes,
        excluir
    };
}