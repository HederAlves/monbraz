import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';

interface Tools {
    id: string;
    amount: number;
    code: string;
    dataPurchase: string;
    name: string;
    observation: string;
    situation: string;
}

const ManageWorkTools: React.FC = () => {
    const [tools, setTools] = useState<Tools[]>([]);
    const [form, setForm] = useState<Partial<Tools>>({});

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const toolSnapshot = await getDocs(collection(firestore, 'tools'));
                const toolsData: Tools[] = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tools[];
                setTools(toolsData);
            } catch (error) {
                console.error('Error fetching tools: ', error);
            }
        };

        fetchTools();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.id) {
            // Atualizar ferramenta existente
            const toolRef = doc(firestore, 'tools', form.id);
            await updateDoc(toolRef, form);
        } else {
            // Adicionar nova ferramenta
            await addDoc(collection(firestore, 'tools'), form);
        }

        setForm({});
        fetchTools();
    };

    const handleEdit = (tool: Tools) => {
        setForm(tool);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'tools', id));
        fetchTools();
    };

    const fetchTools = async () => {
        const toolSnapshot = await getDocs(collection(firestore, 'tools'));
        const toolsData: Tools[] = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tools[];
        setTools(toolsData);
    };

    return (
        <div>
            <h2>Gerenciar Ferramentas</h2>

            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="code"
                    placeholder="Código"
                    value={form.code || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="date"
                    name="dataPurchase"
                    placeholder="Data da Compra"
                    value={form.dataPurchase || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="observation"
                    placeholder="Observação"
                    value={form.observation || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="situation"
                    placeholder="Situação"
                    value={form.situation || ''}
                    onChange={handleInputChange}
                />
                <button type="submit">{form.id ? 'Atualizar' : 'Adicionar'}</button>
            </form>

            <ul>
                {tools.map(tool => (
                    <li key={tool.id}>
                        <strong>Código:</strong> {tool.code} <br />
                        <strong>Data da Compra:</strong> {tool.dataPurchase} <br />
                        <strong>Nome:</strong> {tool.name} <br />
                        <strong>Observação:</strong> {tool.observation} <br />
                        <strong>Situação:</strong> {tool.situation} <br />
                        <button onClick={() => handleEdit(tool)}>Editar</button>
                        <button onClick={() => handleDelete(tool.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageWorkTools;
