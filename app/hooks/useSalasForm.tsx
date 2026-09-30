'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../lib/api';
import { Sala } from '@/app/types/Sala';
import Swal from 'sweetalert2';

export function useSalasForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');

    const [nome, setNome] = useState('');
    const [leitorId, setLeitorId] = useState('');

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const extrairErro = (error: any, mensagemPadrao: string) => {
        const data = error.response?.data;

        if (data) {
            if (data.erro) return String(data.erro);
            if (data.message) return String(data.message);
            if (data.error) return String(data.error);
        }

        return error.message || mensagemPadrao;
    };

    useEffect(() => {
        if (idParam) {
            buscarSalaPorId(Number(idParam));
        }
    }, [idParam]);

    const buscarSalaPorId = async (id: number) => {
        setCarregando(true);

        try {
            const resposta = await api.get(`/sala/${id}`);
            const sala = resposta.data;

            setEditandoId(sala.id!);
            setNome(String(sala.nome));
            setLeitorId(sala.leitorId ? String(sala.leitorId) : '');

        } catch (error: any) {
            Swal.fire({
                title: 'Erro!',
                text: extrairErro(
                    error,
                    "Erro ao buscar os detalhes da sala."
                ),
                icon: 'error',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d",
            });

            router.push('/sala');

        } finally {
            setCarregando(false);
        }
    };

    const salvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);

        try {
            if (editandoId) {

                const dados = {
                    nome,
                    leitorId: leitorId || null
                };

                await api.put(`/sala/${editandoId}`, dados);

            } else {

                const dados: Sala = {
                    nome,
                    leitorId: leitorId || undefined
                };

                await api.post('/sala', dados);
            }

            await Swal.fire({
                title: 'Sucesso!',
                text: 'Sala salva com sucesso!',
                icon: 'success',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d",
            });

            router.push('/sala');

        } catch (error: any) {
            Swal.fire({
                title: 'Atenção!',
                text: extrairErro(
                    error,
                    "Erro ao salvar a sala."
                ),
                icon: 'warning',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d",
            });

        } finally {
            setSalvando(false);
        }
    };

    const cancelar = () => {
        router.push('/sala');
    };

    return {
        nome,
        setNome,
        leitorId,
        setLeitorId,
        editandoId,
        carregando,
        salvando,
        salvar,
        cancelar
    };
}