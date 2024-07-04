import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';

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

const BrowserWorkTools: React.FC = () => {
    const [tools, setTools] = useState<Tools[]>([]);

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

    return (
        <Container>
            <Title>Lista de Ferramentas</Title>
            <List>
                {tools.map(tool => (
                    <ListItem key={tool.id}>
                        <Strong>Nome:</Strong> {tool.name} <br />
                        <Strong>Código:</Strong> {tool.code} <br />
                        <Strong>Data da Compra:</Strong> {tool.dataPurchase} <br />
                        <Strong>Observação:</Strong> {tool.observation} <br />
                        <Strong>Situação:</Strong> {tool.situation} <br />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default BrowserWorkTools;
