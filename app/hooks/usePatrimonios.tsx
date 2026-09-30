'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Patrimonio } from '@/app/types/Patrimonio';
import Swal from 'sweetalert2';

export function usePatrimonios() {
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
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

    const listarPatrimonios = useCallback(async () => {
        setLoading(true);

        try {
            const resposta = await api.get('/patrimonio');
            setPatrimonios(resposta.data);
        } catch (error: any) {
            Swal.fire({
                title: 'Erro!',
                text: extrairErro(error, "Erro ao buscar patrimônios"),
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
            title: 'Excluir patrimônio?',
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
                await api.delete(`/patrimonio/${id}`);

                Swal.fire(
                    'Excluído!',
                    'O patrimônio foi removido.',
                    'success'
                );

                listarPatrimonios();
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
        patrimonios,
        loading,
        listarPatrimonios,
        excluir
    };
}