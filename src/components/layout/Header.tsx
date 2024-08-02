import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 1146px;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
`;

const getTitle = (pathname: string): string => {
    switch (pathname) {
        case '/':
            return 'Criar Ordem de Trabalho';
        case '/workOrders':
            return 'Ordens de Serviço';
        case '/employees':
            return 'Funcionários';
        case '/workTools':
            return 'Ferramentas';
        case '/accessories':
            return 'Acessórios';
        case '/materials':
            return 'Materiais';
        case '/rawMaterials':
            return 'Matérias Prima';
        case '/registrations':
            return 'Cadastros';
        case '/createWorkOrder':
            return 'Gerenciamento de Ordem de Trabalho';
        case '/manageEmployees':
            return 'Gerenciamento de Funcionários';
        case '/ManageWorkTools':
            return 'Gerenciamento de Ferramentas';
        case '/manageAcessories':
            return 'Gerenciamento de Acessórios';
        case '/ManageMaterials':
            return 'Gerenciamento de Materiais';
        case '/ManageRawMaterials':
            return 'Gerenciamento de Matéria Prima';
        default:
            return 'MonBraz';
    }
};

const Header: React.FC = () => {
    const location = useLocation();
    const title = getTitle(location.pathname);

    return <HeaderContainer><h3>{title}</h3></HeaderContainer>;
};

export default Header;
