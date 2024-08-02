import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a2e;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const Select = styled.select`
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #1a1a2e;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #161628;
    }
`;

const CreateWorkOrder = () => {
    const [employees, setEmployees] = useState<{ id: string; name: string; }[]>([]);
    const [tools, setTools] = useState<{ id: string; code: string; name: string; }[]>([]);
    const [accessories, setAccessories] = useState<{ id: string; code: string; name: string; }[]>([]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
    const [order, setOrder] = useState({
        number: '',
        employeeName: '',
        activityName: '',
        toolsUsed: '',
        accessoriesUsed: '',
        materialsUsed: '',
        rawMaterialsUsed: '',
        createdAt: new Date().toISOString(),
        closedAt: '',
        closed: false,
    });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fetchCollection = async (collectionName: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
            try {
                const querySnapshot = await getDocs(collection(firestore, collectionName));
                const list = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setState(list);
            } catch (error) {
                console.error(`Error fetching ${collectionName}: `, error);
            }
        };

        fetchCollection('employees', setEmployees);
        fetchCollection('tools', setTools);
        fetchCollection('accessories', setAccessories);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newOrder = {
                ...order,
                toolsUsed: selectedTools.join(', '),
                accessoriesUsed: selectedAccessories.join(', '),
            };
            await addDoc(collection(firestore, 'workOrders'), newOrder);
            setOrder({
                number: '',
                employeeName: '',
                activityName: '',
                toolsUsed: '',
                accessoriesUsed: '',
                materialsUsed: '',
                rawMaterialsUsed: '',
                createdAt: new Date().toISOString(),
                closedAt: '',
                closed: false,
            });
            setSelectedTools([]);
            setSelectedAccessories([]);
        } catch (error) {
            console.error('Erro ao adicionar ordem de serviço: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrder(prevOrder => ({
            ...prevOrder,
            [name]: value
        }));
    };

    const handleToolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        setSelectedTools(prevSelectedTools => {
            if (checked) {
                return [...prevSelectedTools, value];
            } else {
                return prevSelectedTools.filter(tool => tool !== value);
            }
        });
    };

    const handleAccessoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        setSelectedAccessories(prevSelectedAccessories => {
            if (checked) {
                return [...prevSelectedAccessories, value];
            } else {
                return prevSelectedAccessories.filter(accessory => accessory !== value);
            }
        });
    };

    return (
        <Container>
            <Title>Criar Ordem de Serviço</Title>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="number"
                    placeholder="Número da Ordem"
                    value={order.number}
                    onChange={handleChange}
                />
                <Select
                    name="employeeName"
                    value={order.employeeName}
                    onChange={handleChange}
                >
                    <option value="">Selecione o Funcionário</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.name}>{employee.name}</option>
                    ))}
                </Select>
                <Input
                    type="text"
                    name="activityName"
                    placeholder="Nome da Atividade"
                    value={order.activityName}
                    onChange={handleChange}
                />
                <div>
                    <strong>Ferramentas Utilizadas:</strong>
                    <CheckboxContainer>
                        {tools.map(tool => (
                            <CheckboxLabel key={tool.id}>
                                <input
                                    type="checkbox"
                                    value={tool.code}
                                    checked={selectedTools.includes(tool.code)}
                                    onChange={handleToolChange}
                                />
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{tool.code}</span>
                                {' '}
                                {tool.name}
                            </CheckboxLabel>
                        ))}
                    </CheckboxContainer>
                </div>
                <div>
                    <strong>Acessórios Utilizados:</strong>
                    <CheckboxContainer>
                        {accessories.map(accessory => (
                            <CheckboxLabel key={accessory.id}>
                                <input
                                    type="checkbox"
                                    value={accessory.code}
                                    checked={selectedAccessories.includes(accessory.code)}
                                    onChange={handleAccessoryChange}
                                />
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{accessory.code}</span>
                                {' '}
                                {accessory.name}
                            </CheckboxLabel>
                        ))}
                    </CheckboxContainer>
                </div>
                <Button type="submit">Criar Ordem de Serviço</Button>
            </Form>
        </Container>
    );
};

export default CreateWorkOrder;
