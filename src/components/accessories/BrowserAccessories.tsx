import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';

interface Accessories {
    id: string;
    code: string;
    dataPurchase: string;
    name: string;
    observation: string;
    situation: string;
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

const BrowserAccessories: React.FC = () => {
    const [accessories, setAccessories] = useState<Accessories[]>([]);

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const accessorySnapshot = await getDocs(collection(firestore, 'accessories'));
                const accessoriesData: Accessories[] = accessorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Accessories[];
                setAccessories(accessoriesData);
            } catch (error) {
                console.error('Error fetching accessories: ', error);
            }
        };

        fetchAccessories();
    }, []);

    return (
        <Container>
            <Title>Lista de Acessórios</Title>
            <List>
                {accessories.map((accessory) => (
                    <ListItem key={accessory.id}>
                        <Strong>Nome:</Strong> {accessory.name} <br />
                        <Strong>Código:</Strong> {accessory.code} <br />
                        <Strong>Observação:</Strong> {accessory.observation} <br />
                        <Strong>Situação:</Strong> {accessory.situation} <br />
                        <Strong>Data da Compra:</Strong> {accessory.dataPurchase} <br />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default BrowserAccessories;
