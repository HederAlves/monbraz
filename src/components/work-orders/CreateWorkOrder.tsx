/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';

const CreateWorkOrder = () => {
    const [employees, setEmployees] = useState<{ id: string; name: string; }[]>([]);
    const [tools, setTools] = useState<{ id: string; code: string; name: string; }[]>([]);
    const [accessories, setAccessories] = useState<{ id: string; name: string; }[]>([]);
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
        <div>
            <h2>Criar Ordem de Serviço</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="number"
                    placeholder="Número da Ordem"
                    value={order.number}
                    onChange={handleChange}
                />
                <select
                    name="employeeName"
                    value={order.employeeName}
                    onChange={handleChange}
                >
                    <option value="">Selecione o Funcionário</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.name}>{employee.name}</option>
                    ))}
                </select>
                <input
                    type="text"
                    name="activityName"
                    placeholder="Nome da Atividade"
                    value={order.activityName}
                    onChange={handleChange}
                />
                <div>
                    <strong>Ferramentas Utilizadas:</strong>
                    {tools.map(tool => (
                        <div key={tool.id}>
                            <input
                                type="checkbox"
                                value={tool.name}
                                checked={selectedTools.includes(tool.name)}
                                onChange={handleToolChange}
                            />
                            <label>
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{tool.code}</span>
                                {' '}
                                {tool.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div>
                    <strong>Acessórios Utilizados:</strong>
                    {accessories.map(accessory => (
                        <div key={accessory.id}>
                            <input
                                type="checkbox"
                                value={accessory.name}
                                checked={selectedAccessories.includes(accessory.name)}
                                onChange={handleAccessoryChange}
                            />
                            <label>
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{accessory.id}</span>
                                {' '}
                                {accessory.name}
                            </label>
                        </div>
                    ))}
                </div>
                <button type="submit">Criar Ordem de Serviço</button>
            </form>
        </div>
    );
};

export default CreateWorkOrder;
