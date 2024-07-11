import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';

interface IRawMaterials {
    length: string;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ListItem = styled.li`
  width: 320px;
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

const BrowserRawMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<IRawMaterials[]>([]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialSnapshot = await getDocs(collection(firestore, 'rawMaterials'));
                const materialsData: IRawMaterials[] = materialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IRawMaterials[];
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
                {materials.map(rawMaterial => (
                    <ListItem key={rawMaterial.id}>
                        <Strong>Nome:</Strong> {rawMaterial.name}<br />
                        <Strong>Comprimento:</Strong> {rawMaterial.length}<br />
                        <Strong>Quantidade:</Strong> {rawMaterial.amount}<br />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default BrowserRawMaterials;
