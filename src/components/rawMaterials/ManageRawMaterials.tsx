import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface RawMaterial {
    id: string;
    name: string;
    length: number;
    width: number;
    amount: number;
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

const ManageRawMaterials: React.FC = () => {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [form, setForm] = useState<Partial<RawMaterial>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchRawMaterials = async () => {
            try {
                const rawMaterialSnapshot = await getDocs(collection(firestore, 'rawMaterials'));
                const rawMaterialsData: RawMaterial[] = rawMaterialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RawMaterial[];
                setRawMaterials(rawMaterialsData);
            } catch (error) {
                console.error('Error fetching raw materials: ', error);
            }
        };

        fetchRawMaterials();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.id) {
            const rawMaterialRef = doc(firestore, 'rawMaterials', form.id);
            await updateDoc(rawMaterialRef, form);
            setIsEditing(false);
        } else {
            await addDoc(collection(firestore, 'rawMaterials'), form);
        }

        setForm({});
        fetchRawMaterials();
    };

    const handleEdit = (rawMaterial: RawMaterial) => {
        setForm(rawMaterial);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'rawMaterials', id));
        fetchRawMaterials();
    };

    const handleCancelEdit = () => {
        setForm({});
        setIsEditing(false);
    };

    const fetchRawMaterials = async () => {
        const rawMaterialSnapshot = await getDocs(collection(firestore, 'rawMaterials'));
        const rawMaterialsData: RawMaterial[] = rawMaterialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RawMaterial[];
        setRawMaterials(rawMaterialsData);
    };

    return (
        <>
            <Container>
                <TitleContainer>
                    <h3>{isEditing ? 'Atualizar Matéria Prima' : 'Adicionar Matéria Prima'}</h3>
                    {isEditing && <CancelButton onClick={handleCancelEdit}>Cancelar Atualização</CancelButton>}
                </TitleContainer>
                <FormContainer>
                    <Form onSubmit={handleFormSubmit}>
                        <FormRow>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Nome"
                                value={form.name || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="number"
                                name="amount"
                                placeholder="Quantidade"
                                value={form.amount || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="number"
                                name="length"
                                placeholder="Comprimento"
                                value={form.length || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="number"
                                name="width"
                                placeholder="Largura"
                                value={form.width || ''}
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
                            <TableCellHeader>Nome</TableCellHeader>
                            <TableCellHeader>Comprimento</TableCellHeader>
                            <TableCellHeader>Largura</TableCellHeader>
                            <TableCellHeader>Quantidade</TableCellHeader>
                            <TableCellHeader>Ações</TableCellHeader>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {rawMaterials.map(rawMaterial => (
                            <TableRow key={rawMaterial.id}>
                                <TableCell style={{ paddingLeft: '10px' }}>{rawMaterial.name}</TableCell>
                                <TableCell>{rawMaterial.length}</TableCell>
                                <TableCell>{rawMaterial.width}</TableCell>
                                <TableCell>{rawMaterial.amount}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleEdit(rawMaterial)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(rawMaterial.id)}><FaTrash /></button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ManageRawMaterials;
