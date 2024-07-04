import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';

interface Materials {
    id: string;
    name: string;
    amount: string;
    tipo: string;
}

const ManageMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<Materials[]>([]);
    const [form, setForm] = useState<Partial<Materials>>({});

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialSnapshot = await getDocs(collection(firestore, 'materials'));
                const materialsData: Materials[] = materialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Materials[];
                setMaterials(materialsData);
            } catch (error) {
                console.error('Error fetching materials: ', error);
            }
        };

        fetchMaterials();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.id) {
            const materialRef = doc(firestore, 'materials', form.id);
            await updateDoc(materialRef, form);
        } else {
            await addDoc(collection(firestore, 'materials'), form);
        }

        setForm({});
        fetchMaterials();
    };

    const handleEdit = (material: Materials) => {
        setForm(material);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'materials', id));
        fetchMaterials();
    };

    const fetchMaterials = async () => {
        const materialSnapshot = await getDocs(collection(firestore, 'materials'));
        const materialsData: Materials[] = materialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Materials[];
        setMaterials(materialsData);
    };

    return (
        <div>
            <h2>Gerenciar Materiais</h2>

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
                    name="amount"
                    placeholder="Quantidade"
                    value={form.amount || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="tipo"
                    placeholder="Tipo"
                    value={form.tipo || ''}
                    onChange={handleInputChange}
                />
                <button type="submit">{form.id ? 'Atualizar' : 'Adicionar'}</button>
            </form>

            <ul>
                {materials.map(material => (
                    <li key={material.id}>
                        <strong>Nome:</strong> {material.name} <br />
                        <strong>Quantidade:</strong> {material.amount} <br />
                        <strong>Tipo:</strong> {material.tipo} <br />
                        <button onClick={() => handleEdit(material)}>Editar</button>
                        <button onClick={() => handleDelete(material.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageMaterials;
