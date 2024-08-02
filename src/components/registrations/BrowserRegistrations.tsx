import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
`;

const CardContainer = styled(Link)`
  width: 200px;
  height: 150px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
  text-decoration: none; /* Remover a decoração de texto do link */

  &:hover {
    transform: scale(1.05);
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  color: ${(props) => props.theme.colors.white};
`;

const Dashboard: React.FC = () => {
  const cards = [
    { title: 'Ordens de Serviço', link: '/createWorkOrder' },
    { title: 'Funcionários', link: '/manageEmployees' },
    { title: 'Ferramentas', link: '/ManageWorkTools' },
    { title: 'Acessórios', link: '/manageAcessories' },
    { title: 'Materiais', link: '/ManageMaterials' },
    { title: 'Matérias Prima', link: '/ManageRawMaterials' },
  ];

  return (
    <DashboardContainer>
      {cards.map((card) => (
        <CardContainer key={card.link} to={card.link}>
          <CardTitle>{card.title}</CardTitle>
        </CardContainer>
      ))}
    </DashboardContainer>
  );
};

export default Dashboard;
