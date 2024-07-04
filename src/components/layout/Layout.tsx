import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <MainContent>{children}</MainContent>
      </div>
    </LayoutContainer>
  );
};

export default Layout;
