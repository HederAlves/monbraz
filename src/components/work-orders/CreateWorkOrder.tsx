/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';

const Container = styled.div`
    width: 800px;
    padding: 20px 20px 5px 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
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

const Select = styled.select`
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

const CheckboxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const Button = styled.button`
    margin-top: 20px;
    margin-bottom: 20px;
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

const CreateWorkOrder: React.FC = () => {
    const [employees, setEmployees] = useState<{ id: string; name: string; }[]>([]);
    const [tools, setTools] = useState<{ id: string; code: string; name: string; }[]>([]);
    const [accessories, setAccessories] = useState<{ id: string; name: string; code: string }[]>([]);
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
                                    value={tool.name}
                                    checked={selectedTools.includes(tool.name)}
                                    onChange={handleToolChange}
                                />
                                {tool.name}
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{tool.code}</span>
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
                                    value={accessory.name}
                                    checked={selectedAccessories.includes(accessory.name)}
                                    onChange={handleAccessoryChange}
                                />
                                {accessory.name}
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{accessory.code}</span>
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
