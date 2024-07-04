import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';

interface Accessories {
    id: string;
    code: string;
    dataPurchase: string;
    name: string;
    observation: string;
    situation: string;
}

const ManageAccessories: React.FC = () => {
    const [accessories, setAccessories] = useState<Accessories[]>([]);
    const [form, setForm] = useState<Partial<Accessories>>({});

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const accessorySnapshot = await getDocs(collection(firestore, 'accessories'));
                const accessoriesData: Accessories[] = accessorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Accessories[];
                setAccessories(accessoriesData);
            } catch (error) {
                console.error('Error fetching accessories: ', error);
            }
        };

        fetchAccessories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.id) {
            // Atualizar acessório existente
            const accessoryRef = doc(firestore, 'accessories', form.id);
            await updateDoc(accessoryRef, form);
        } else {
            // Adicionar novo acessório
            await addDoc(collection(firestore, 'accessories'), form);
        }

        setForm({});
        fetchAccessories();
    };

    const handleEdit = (accessory: Accessories) => {
        setForm(accessory);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'accessories', id));
        fetchAccessories();
    };

    const fetchAccessories = async () => {
        const accessorySnapshot = await getDocs(collection(firestore, 'accessories'));
        const accessoriesData: Accessories[] = accessorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Accessories[];
        setAccessories(accessoriesData);
    };

    return (
        <div>
            <h2>Gerenciar Acessórios</h2>

            <form onSubmit={handleFormSubmit}>
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
                    name="name"
                    placeholder="Nome"
                    value={form.name || ''}
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
                {accessories.map(accessory => (
                    <li key={accessory.id}>
                        <strong>Código:</strong> {accessory.code} <br />
                        <strong>Data da Compra:</strong> {accessory.dataPurchase} <br />
                        <strong>Nome:</strong> {accessory.name} <br />
                        <strong>Observação:</strong> {accessory.observation} <br />
                        <strong>Situação:</strong> {accessory.situation} <br />
                        <button onClick={() => handleEdit(accessory)}>Editar</button>
                        <button onClick={() => handleDelete(accessory.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageAccessories;
