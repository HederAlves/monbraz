import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';

interface Employee {
  id: string;
  name: string;
  email: string;
  office: string;
  permissions: string;
  phone: string;
  imageUrl: string;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const Strong = styled.strong`
  color: ${(props) => props.theme.colors.secondary};
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const BrowserEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeSnapshot = await getDocs(collection(firestore, 'employees'));
        const employeesData: Employee[] = employeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Employee[];
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error fetching employees: ', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Container>
      <Title>Lista de Funcionários</Title>
      <List>
        {employees.map((employee) => (
          <ListItem key={employee.id}>
            <Image src={employee.imageUrl} alt={employee.name} />
            <div>
              <Strong>Nome:</Strong> {employee.name} <br />
              <Strong>Email:</Strong> {employee.email} <br />
              <Strong>Cargo:</Strong> {employee.office} <br />
              <Strong>Permissões:</Strong> {employee.permissions} <br />
              <Strong>Telefone:</Strong> {employee.phone} <br />
            </div>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BrowserEmployees;
