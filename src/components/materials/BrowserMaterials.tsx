import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import firestore from '../../firebaseConfig';
import styled from 'styled-components';

interface IMaterials {
    id: string;
    name: string;
    amount: string;
    tipo: string;
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

const BrowserMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<IMaterials[]>([]);

    useEffect(() => {

        const fetchMaterials = async () => {
            try {
                const materialSnapshot = await getDocs(collection(firestore, 'materials'));
                const materialsData: IMaterials[] = materialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IMaterials[];
                setMaterials(materialsData);
            } catch (error) {
                console.error('Error fetching materials: ', error);
            }
        };

        fetchMaterials();
    }, []);

    return (
        <Container>

            <Title>Lista de Materiais</Title>
            <List>
                {materials.map(material => (
                    <ListItem key={material.id}>
                        <Strong>Nome:</Strong> {material.name} <br />
                        <Strong>Quantidade:</Strong> {material.amount} <br />
                        <Strong>Tipo:</Strong> {material.tipo} <br />
                    </ListItem>
                ))}
            </List>

        </Container>
    );
};

export default BrowserMaterials;
