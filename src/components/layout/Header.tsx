import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  width: 1116px;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
`;

const getTitle = (pathname: string): string => {
    switch (pathname) {
        case '/accessories':
            return 'Acessórios';
        case '/employees':
            return 'Funcionários';
        case '/materials':
            return 'Materiais';
        case '/rawMaterials':
            return 'Matérias Prima';
        case '/workOrders':
            return 'Ordens de Serviço';
        case '/workTools':
            return 'Ferramentas';
        case '/registrations':
            return 'Cadastros';
        case '/ManageRawMaterials':
            return 'Gerenciamento de Matérias Primas';
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
