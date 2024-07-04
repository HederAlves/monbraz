import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';

interface WorkOrder {
    id: string;
    number: string;
    employeeName: string;
    activityName: string;
    toolsUsed: string;
    accessoriesUsed: string;
    materialsUsed: string;
    rawMaterialsUsed: string;
    closed: boolean;
}

const Container = styled.div`
    padding: 20px;
`;

const Title = styled.h2`
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 20px;
`;

const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const ListItem = styled.li`
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Strong = styled.strong`
    color: ${(props) => props.theme.colors.secondary};
`;

const BrowserWorkOrders: React.FC = () => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const workOrderSnapshot = await getDocs(collection(firestore, 'workOrders'));
                const workOrdersData: WorkOrder[] = workOrderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkOrder[];
                setWorkOrders(workOrdersData);
            } catch (error) {
                console.error('Error fetching work orders: ', error);
            }
        };

        fetchWorkOrders();
    }, []);

    return (
        <Container>
            <Title>Lista de Ordens de Serviço</Title>
            <List>
                {workOrders.map(workOrder => (
                    <ListItem key={workOrder.id}>
                        <Strong>Número:</Strong> {workOrder.number} <br />
                        <Strong>Funcionário:</Strong> {workOrder.employeeName} <br />
                        <Strong>Atividade:</Strong> {workOrder.activityName} <br />
                        <Strong>Ferramentas Utilizadas:</Strong> {workOrder.toolsUsed} <br />
                        <Strong>Acessórios Utilizados:</Strong> {workOrder.accessoriesUsed} <br />
                        <Strong>Materiais Utilizados:</Strong> {workOrder.materialsUsed} <br />
                        <Strong>Matérias-Primas Utilizadas:</Strong> {workOrder.rawMaterialsUsed} <br />
                        <Strong>Finalizada:</Strong> {workOrder.closed ? 'Sim' : 'Não'} <br />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default BrowserWorkOrders;
