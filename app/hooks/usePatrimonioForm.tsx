'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../lib/api';
import { Patrimonio } from '@/app/types/Patrimonio';
import Swal from 'sweetalert2';

export function usePatrimonioForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');

    const [nome, setNome] = useState('');
    const [numeroPatrimonio, setNumeroPatrimonio] = useState('');
    const [rfid, setRfid] = useState('');
    const [salaId, setSalaId] = useState<number | null>(null);
    const [status, setStatus] = useState('');
    const [foto, setFoto] = useState('');

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
            buscarPatrimonioPorId(Number(idParam));
        }
    }, [idParam]);

    const buscarPatrimonioPorId = async (id: number) => {
        setCarregando(true);

        try {
            const resposta = await api.get(`/patrimonio/${id}`);
            const patrimonio = resposta.data;

            setEditandoId(patrimonio.id!);
            setNome(String(patrimonio.nome));
            setNumeroPatrimonio(String(patrimonio.numeroPatrimonio));
            setRfid(patrimonio.rfid ? String(patrimonio.rfid) : '');
            setSalaId(patrimonio.salaId ?? null);
            setStatus(String(patrimonio.status));
            setFoto(patrimonio.foto ? String(patrimonio.foto) : '');

        } catch (error: any) {
            Swal.fire({
                title: 'Erro!',
                text: extrairErro(
                    error,
                    "Erro ao buscar os detalhes do patrimônio."
                ),
                icon: 'error',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d",
            });

            router.push('/patrimonio');

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
                    numeroPatrimonio,
                    rfid: rfid || null,
                    salaId,
                    status,
                    foto: foto || null
                };

                await api.put(`/patrimonio/${editandoId}`, dados);

            } else {

                const dados: Patrimonio = {
                    nome,
                    numeroPatrimonio,
                    rfid: rfid || undefined,
                    salaId: salaId ?? undefined,
                    status,
                    foto: foto || undefined
                };

                await api.post('/patrimonio', dados);
            }

            await Swal.fire({
                title: 'Sucesso!',
                text: 'Patrimônio salvo com sucesso!',
                icon: 'success',
                color: "#e6e6e6",
                confirmButtonColor: '#ca0101',
                background: "#211d1d",
            });

            router.push('/patrimonio');

        } catch (error: any) {
            Swal.fire({
                title: 'Atenção!',
                text: extrairErro(
                    error,
                    "Erro ao salvar o patrimônio."
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
        router.push('/patrimonio');
    };

    return {
        nome,
        setNome,
        numeroPatrimonio,
        setNumeroPatrimonio,
        rfid,
        setRfid,
        salaId,
        setSalaId,
        status,
        setStatus,
        foto,
        setFoto,
        editandoId,
        carregando,
        salvando,
        salvar,
        cancelar
    };
}