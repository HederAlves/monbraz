import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface Tools {
    id: string;
    amount: number;
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

const ManageWorkTools: React.FC = () => {
    const [tools, setTools] = useState<Tools[]>([]);
    const [form, setForm] = useState<Partial<Tools>>({});
    const [isEditing, setIsEditing] = useState(false);

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
            const toolRef = doc(firestore, 'tools', form.id);
            await updateDoc(toolRef, form);
            setIsEditing(false);
        } else {
            await addDoc(collection(firestore, 'tools'), form);
        }

        setForm({});
        fetchTools();
    };

    const handleEdit = (tool: Tools) => {
        setForm(tool);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'tools', id));
        fetchTools();
    };

    const handleCancelEdit = () => {
        setForm({});
        setIsEditing(false);
    };

    const fetchTools = async () => {
        const toolSnapshot = await getDocs(collection(firestore, 'tools'));
        const toolsData: Tools[] = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tools[];
        setTools(toolsData);
    };

    return (
        <>
            <Container>
                <TitleContainer>
                    <h3>{isEditing ? 'Atualizar Ferramenta' : 'Adicionar Ferramenta'}</h3>
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
                                type="text"
                                name="code"
                                placeholder="Código"
                                value={form.code || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="date"
                                name="dataPurchase"
                                placeholder="Data da Compra"
                                value={form.dataPurchase || ''}
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
                        {tools.map(tool => (
                            <TableRow key={tool.id}>
                                <TableCell style={{ paddingLeft: '10px' }}>{tool.code}</TableCell>
                                <TableCell>{tool.dataPurchase}</TableCell>
                                <TableCell>{tool.name}</TableCell>
                                <TableCell>{tool.observation}</TableCell>
                                <TableCell>{tool.situation}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleEdit(tool)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(tool.id)}><FaTrash /></button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ManageWorkTools;
