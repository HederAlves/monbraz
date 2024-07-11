import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface Employee {
    id: string;
    name: string;
    email: string;
    office: string;
    permissions: string;
    phone: string;
    imageUrl?: string;
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

const ManageEmployees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [form, setForm] = useState<Partial<Employee>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const employeeSnapshot = await getDocs(collection(firestore, 'employees'));
            const employeesData: Employee[] = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
            setEmployees(employeesData);
        } catch (error) {
            console.error('Error fetching employees: ', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let imageUrl = '';
        if (imageFile) {
            const storage = getStorage();
            const storageRef = ref(storage, `employees/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        } else {
            imageUrl = '';
        }

        const newEmployee = { ...form, imageUrl };

        if (form.id) {
            const employeeRef = doc(firestore, 'employees', form.id);
            await updateDoc(employeeRef, newEmployee);
            setIsEditing(false);
        } else {
            await addDoc(collection(firestore, 'employees'), newEmployee);
        }

        setForm({});
        setImageFile(null);
        fetchEmployees();
    };

    const handleEdit = (employee: Employee) => {
        setForm(employee);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'employees', id));
        fetchEmployees();
    };

    const handleCancelEdit = () => {
        setForm({});
        setIsEditing(false);
    };

    return (
        <>
            <Container>
                <TitleContainer>
                    <h3>{isEditing ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}</h3>
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
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="text"
                                name="office"
                                placeholder="Cargo"
                                value={form.office || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="permissions"
                                placeholder="Permissões"
                                value={form.permissions || ''}
                                onChange={handleInputChange}
                            />
                        </FormRow>
                        <FormRow>
                            <Input
                                type="text"
                                name="phone"
                                placeholder="Telefone"
                                value={form.phone || ''}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="file"
                                name="image"
                                placeholder="Imagem"
                                onChange={handleFileChange}
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
                            <TableCellHeader>Email</TableCellHeader>
                            <TableCellHeader>Cargo</TableCellHeader>
                            <TableCellHeader>Permissões</TableCellHeader>
                            <TableCellHeader>Telefone</TableCellHeader>
                            <TableCellHeader>Ações</TableCellHeader>
                        </TableRow>
                    </TableHeader>
                    <tbody>
                        {employees.map(employee => (
                            <TableRow key={employee.id}>
                                <TableCell style={{ paddingLeft: '10px' }}>{employee.name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.office}</TableCell>
                                <TableCell>{employee.permissions}</TableCell>
                                <TableCell>{employee.phone}</TableCell>
                                <TableCell>
                                    <button onClick={() => handleEdit(employee)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(employee.id)}><FaTrash /></button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ManageEmployees;
