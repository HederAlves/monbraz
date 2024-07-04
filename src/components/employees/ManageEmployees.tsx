import React, { useState, useEffect, FormEvent } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firestore from '../../firebaseConfig';

interface Employee {
    id: string;
    name: string;
    email: string;
    office: string;
    permissions: string;
    phone: string;
    imageUrl?: string;
}

const ManageEmployees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [form, setForm] = useState<Partial<Employee>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeeSnapshot = await getDocs(collection(firestore, 'employees'));
                const employeesData: Employee[] = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error fetching employees: ', error);
            }
        };

        fetchEmployees();
    }, []);

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

        let imageUrl = form.imageUrl;
        if (imageFile) {
            const storage = getStorage();
            const storageRef = ref(storage, `employees/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        if (form.id) {
            const employeeRef = doc(firestore, 'employees', form.id);
            await updateDoc(employeeRef, { ...form, imageUrl });
        } else {
            await addDoc(collection(firestore, 'employees'), { ...form, imageUrl });
        }

        setForm({});
        setImageFile(null);
        fetchEmployees();
    };

    const handleEdit = (employee: Employee) => {
        setForm(employee);
    };

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(firestore, 'employees', id));
        fetchEmployees();
    };

    const fetchEmployees = async () => {
        const employeeSnapshot = await getDocs(collection(firestore, 'employees'));
        const employeesData: Employee[] = employeeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
        setEmployees(employeesData);
    };

    return (
        <div>
            <h2>Gerenciar Funcionários</h2>

            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={form.name || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="office"
                    placeholder="Cargo"
                    value={form.office || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="permissions"
                    placeholder="Permissões"
                    value={form.permissions || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Telefone"
                    value={form.phone || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    name="image"
                    placeholder="Imagem"
                    onChange={handleFileChange}
                />
                <button type="submit">{form.id ? 'Atualizar' : 'Adicionar'}</button>
            </form>

            <ul>
                {employees.map(employee => (
                    <li key={employee.id}>
                        {employee.imageUrl && <img src={employee.imageUrl} alt={employee.name} width="50" height="50" style={{ borderRadius: '50%' }} />}
                        <strong>Nome:</strong> {employee.name} <br />
                        <strong>Email:</strong> {employee.email} <br />
                        <strong>Cargo:</strong> {employee.office} <br />
                        <strong>Permissões:</strong> {employee.permissions} <br />
                        <strong>Telefone:</strong> {employee.phone} <br />
                        <button onClick={() => handleEdit(employee)}>Editar</button>
                        <button onClick={() => handleDelete(employee.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageEmployees;
