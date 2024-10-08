import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 220px;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const SidebarLink = styled(NavLink)`
  color: ${(props) => props.theme.colors.white};
  text-decoration: none;
  margin: 10px 0;
  font-size: 18px;
  &.active {
    font-weight: bold;
  }
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <h1 style={{ marginBottom: '20px' }}>MonBraz</h1>
      <SidebarLink to="/">Inicio</SidebarLink>
      <SidebarLink to="/workOrders">Ordens de serviço</SidebarLink>
      <SidebarLink to="/registrations">Cadastros</SidebarLink>
      <SidebarLink to="/employees">Funcionários</SidebarLink>
      <SidebarLink to="/workTools">Ferramentas</SidebarLink>
      <SidebarLink to="/accessories">Acessórios</SidebarLink>
      <SidebarLink to="/materials">Materiais</SidebarLink>
      <SidebarLink to="/rawMaterials">Matérias Prima</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
