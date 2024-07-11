import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface Accessories {
    id: string;
    code: string;
    dataPurchase: string;
    name: string;
    observation: string;
    situation: string;
}

const Container = styled.div`
    width: 800px;
    padding: 20px 20px 5px 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const FormContainer = styled.div`
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const FormRow = styled.div`
    display: flex;
    gap: 10px;
`;

const TableContainer = styled.div`
    width: 800px;
    margin-top: 16px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.thead`
    background-color: ${(props) => props.theme.colors.secondary};
    color: white;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f5f5f5;
    }
`;

const TableCell = styled.td`
    border-bottom: 1px solid #ccc;
    text-align: center;
    &:first-child {
        text-align: left;
    }
`;

const TableCellHeader = styled.th`
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
    &:first-child {
        text-align: left;
    }
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    &:focus {
        border-color: #3f51b5;
        box-shadow: 0 0 5px rgba(63, 81, 181, 0.5);
        outline: none;
    }
`;

const Button = styled.button`
    margin-top: 8px;
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: ${(props) => props.theme.colors.secondary};
    }
`;

const CancelButton = styled.button`
    background-color: #ffffff;
    color: #f44336;
    &:hover {
        background-color: #ffffff;
        color: #800000;
        border-color: #800000;
    }
`;

const ManageAccessories: React.FC = () => {
    const [accessories, setAccessories] = useState<Accessories[]>([]);
    const [form, setForm] = useState<Partial<Accessories>>({});
    const [isEditing, setIsEditing] = useState(false);

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
            const accessoryRef = doc(firestore, 'accessories', form.id);
            await updateDoc(accessoryRef, form);
            setIsEditing(false);
        } else {
            await addDoc(collection(firestore, 'accessories'), form);
        }

        setForm({});
        fetchAccessories();
    };

    const handleEdit = (accessory: Accessories) => {
        setForm(accessory);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'accessories', id));
        fetchAccessories();
    };

    const handleCancelEdit = () => {
        setForm({});
        setIsEditing(false);
    };

    const fetchAccessories = async () => {
        const accessorySnapshot = await getDocs(collection(firestore, 'accessories'));
        const accessoriesData: Accessories[] = accessorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Accessories[];
        setAccessories(accessoriesData);
    };

    return (
        <>
            <Container>
                <TitleContainer>
                    <h3>{isEditing ? 'Atualizar Acessório' : 'Adicionar Acessório'}</h3>
                    {isEditing && <CancelButton onClick={handleCancelEdit}>Cancelar Atualização</CancelButton>}
                </TitleContainer>
                <FormContainer>
                    <Form onSubmit={handleFormSubmit}>
                        <FormRow>
                            <Input
                                type="text"
                                name="code"
                                placeholder="Código"
                                value={form.code || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="date"
                                name="dataPurchase"
                                placeholder="Data da Compra"
                                value={form.dataPurchase || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nome"
                                value={form.name || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="observation"
                                placeholder="Observação"
                                value={form.observation || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="text"
                                name="situation"
                                placeholder="Situação"
                                value={form.situation || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <Button type="submit">{isEditing ? 'Atualizar' : 'Adicionar'}</Button>
                    </Form>
                </FormContainer>
            </Container>
            <TableContainer>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCellHeader>Código</TableCellHeader>
                            <TableCellHeader>Data da Compra</TableCellHeader>
                            <TableCellHeader>Nome</TableCellHeader>
                            <TableCellHeader>Observação</TableCellHeader>
                            <TableCellHeader>Situação</TableCellHeader>
                            <TableCellHeader>Ações</TableCellHeader>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {accessories.map(accessory => (
                            <TableRow key={accessory.id}>
                                <TableCell style={{ paddingLeft: '10px' }}>{accessory.code}</TableCell>
                                <TableCell>{accessory.dataPurchase}</TableCell>
                                <TableCell>{accessory.name}</TableCell>
                                <TableCell>{accessory.observation}</TableCell>
                                <TableCell>{accessory.situation}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleEdit(accessory)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(accessory.id)}><FaTrash /></button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ManageAccessories;
