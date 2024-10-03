import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import firestore from '../../firebaseConfig';
import { FaEye, FaTrash } from 'react-icons/fa';

interface WorkOrder {
    id: string;
    number: string;
    employeeName: string;
    activityName: string;
    toolsUsed: string;
    accessoriesUsed: string;
    materialsUsed: string;
    rawMaterialsUsed: string;
    closed: boolean;
}

interface RawMaterial {
    id: string;
    name: string;
    width: string;
    length: string;
}

interface RawMaterialInput {
    name: string;
    width: string;
    length: string;
    amount: string;
    hoursSpent: string;
}

const Container = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 20px;
`;

const TableContainer = styled.div`
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
    width: 100%;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.thead`
    background-color: ${(props) => props.theme.colors.secondary};
    color: white;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f5f5f5;
    }
`;

const TableCell = styled.td`
    border-bottom: 1px solid #ccc;
    text-align: center;

    &:first-child {
        text-align: left;
        padding-left: 10px;
    }
`;

const TableCellHeader = styled.th`
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;

    &:first-child {
        text-align: left;
        padding-left: 10px;
    }
`;

const Modal = styled.div<{ isOpen: boolean }>`
    display: ${(props) => (props.isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20vh 0px 0px 30vw;
`;

const ModalHeader = styled.div`
    margin-top: 50px;
    background: ${(props) => props.theme.colors.secondary};
    text-align: center;
    color: white;
    border-radius: 8px 8px 0px 0px;
    padding: 10px;
    max-width: 600px;
`;

const ModalContent = styled.div`
    padding: 20px;
    magin-top: 50px;
    background: white;
    border-radius: 0px 0px 8px 8px;
    max-width: 600px;
`;

const CloseButton = styled.button`
    position: fixed;
    margin-top: -30px;
    margin-left: 500px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    float: right;
    font-size: 16px;

    &:hover {
        background: #d32f2f;
    }
`;

const ModalOrder = styled.div<{ isOpen: boolean }>`
    display: ${(props) => (props.isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20vh 0px 0px 30vw;
`;

const ModalContentOrder = styled.div`
    padding: 20px;
    background: white;
    border-radius: 0px 0px 8px 8px;
    max-width: 600px;
`;

const CloseOrderButton = styled.button`
    background: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    float: right;
    font-size: 16px;

    &:hover {
        background: #d32f2f;
    }
`;

const ConfirmButton = styled.button`
    background: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background: ${(props) => props.theme.colors.secondary};
    }
`;

const WrapperButton = styled.div`
    display: flex;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;

    &:focus {
        border-color: ${(props) => props.theme.colors.primary};
        outline: none;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;

    &:focus {
        border-color: ${(props) => props.theme.colors.primary};
        outline: none;
    }
`;

const Label = styled.label`
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
    display: block;
`;

const BrowserWorkOrders: React.FC = () => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [openWorkOrders, setOpenWorkOrders] = useState<WorkOrder[]>([]);
    const [closedWorkOrders, setClosedWorkOrders] = useState<WorkOrder[]>([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
    const [rawMaterialInputs, setRawMaterialInputs] = useState<RawMaterialInput[]>([{ name: '', width: '', length: '', amount: '', hoursSpent: '' }]);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const workOrderSnapshot = await getDocs(collection(firestore, 'workOrders'));
                const workOrdersData: WorkOrder[] = workOrderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkOrder[];
                setWorkOrders(workOrdersData);
                setOpenWorkOrders(workOrdersData.filter(order => !order.closed));
                setClosedWorkOrders(workOrdersData.filter(order => order.closed));

                const rawMaterialSnapshot = await getDocs(collection(firestore, 'rawMaterials'));
                const rawMaterialsData: RawMaterial[] = rawMaterialSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RawMaterial[];
                setRawMaterials(rawMaterialsData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchCollections();
    }, []);

    const handleView = (workOrder: WorkOrder) => {
        setSelectedWorkOrder(workOrder);
        setIsModalOpen(true);
    };

    const handleDelete = (workOrder: WorkOrder) => {
        setSelectedWorkOrder(workOrder);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmClose = async () => {
        if (selectedWorkOrder) {
            try {
                await updateDoc(doc(firestore, 'workOrders', selectedWorkOrder.id), {
                    closed: true,
                    rawMaterialsUsed: rawMaterialInputs
                });

                setWorkOrders(workOrders.filter(workOrder => workOrder.id !== selectedWorkOrder.id));
                setOpenWorkOrders(openWorkOrders.filter(workOrder => workOrder.id !== selectedWorkOrder.id));
                setClosedWorkOrders([...closedWorkOrders, { ...selectedWorkOrder, closed: true }]);

                setIsConfirmModalOpen(false);
                setSelectedWorkOrder(null);
            } catch (error) {
                console.error('Erro ao fechar a ordem de serviço: ', error);
            }
        }
    };

    const handleCancelClose = () => {
        setIsConfirmModalOpen(false);
        setSelectedWorkOrder(null);
    };

    const handleRawMaterialChange = (index: number, field: keyof RawMaterialInput, value: string) => {
        const newRawMaterialInputs = [...rawMaterialInputs];
        newRawMaterialInputs[index][field] = value;
        setRawMaterialInputs(newRawMaterialInputs);
    };

    const handleRawMaterialSelect = (index: number, value: string) => {
        const selectedMaterial = rawMaterials.find(material => material.name === value);
        if (selectedMaterial) {
            handleRawMaterialChange(index, 'name', selectedMaterial.name);
            handleRawMaterialChange(index, 'width', selectedMaterial.width);
            handleRawMaterialChange(index, 'length', selectedMaterial.length);
        }
    };

    return (
        <Container>
            <div>
                <Title>Ordens de Serviço Abertas</Title>
                <TableContainer>
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCellHeader>Número</TableCellHeader>
                                <TableCellHeader>Funcionário</TableCellHeader>
                                <TableCellHeader>Atividade</TableCellHeader>
                                <TableCellHeader>Finalizada</TableCellHeader>
                                <TableCellHeader>Ações</TableCellHeader>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {openWorkOrders.map(workOrder => (
                                <TableRow key={workOrder.id}>
                                    <TableCell>{workOrder.number}</TableCell>
                                    <TableCell>{workOrder.employeeName}</TableCell>
                                    <TableCell>{workOrder.activityName}</TableCell>
                                    <TableCell>{workOrder.closed ? 'Fechada' : 'Aberta'}</TableCell>
                                    <TableCell>
                                        <button onClick={() => handleView(workOrder)}><FaEye /></button>
                                        <button onClick={() => handleDelete(workOrder)}><FaTrash /></button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <Title>Ordens de Serviço Fechadas</Title>
                <TableContainer>
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCellHeader>Número</TableCellHeader>
                                <TableCellHeader>Funcionário</TableCellHeader>
                                <TableCellHeader>Atividade</TableCellHeader>
                                <TableCellHeader>Finalizada</TableCellHeader>
                                <TableCellHeader>Ações</TableCellHeader>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {closedWorkOrders.map(workOrder => (
                                <TableRow key={workOrder.id}>
                                    <TableCell>{workOrder.number}</TableCell>
                                    <TableCell>{workOrder.employeeName}</TableCell>
                                    <TableCell>{workOrder.activityName}</TableCell>
                                    <TableCell>{workOrder.closed ? 'Fechada' : 'Aberta'}</TableCell>
                                    <TableCell>
                                        <button onClick={() => handleView(workOrder)}><FaEye /></button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </div>

            <Modal isOpen={isModalOpen}>
                <ModalHeader>Detalhes da Ordem de Serviço</ModalHeader>
                <ModalContent>
                    {selectedWorkOrder && (
                        <>
                            <p><strong>Número:</strong> {selectedWorkOrder.number}</p>
                            <p><strong>Funcionário:</strong> {selectedWorkOrder.employeeName}</p>
                            <p><strong>Atividade:</strong> {selectedWorkOrder.activityName}</p>
                            <p><strong>Ferramentas Utilizadas:</strong> {selectedWorkOrder.toolsUsed}</p>
                            <p><strong>Acessórios Utilizados:</strong> {selectedWorkOrder.accessoriesUsed}</p>
                            <p><strong>Materiais Utilizados:</strong> {selectedWorkOrder.materialsUsed}</p>
                            <p><strong>Matérias-Primas Utilizadas:</strong> {selectedWorkOrder.rawMaterialsUsed}</p>
                            <p><strong>Finalizada:</strong> {selectedWorkOrder.closed ? 'Sim' : 'Não'}</p>
                            <CloseButton onClick={() => setIsModalOpen(false)}>Fechar</CloseButton>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ModalOrder isOpen={isConfirmModalOpen}>
                <ModalHeader style={{ marginTop: '-30px' }} >Fechar Ordem de Serviço</ModalHeader>
                <ModalContentOrder>
                    {selectedWorkOrder && (
                        <>
                            {rawMaterialInputs.map((input, index) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }} key={index}>
                                    <Label>
                                        Matéria-Prima:
                                    </Label>
                                    <Select value={input.name} onChange={(e) => handleRawMaterialSelect(index, e.target.value)}>
                                        <option value="">Selecione</option>
                                        {rawMaterials.map(material => (
                                            <option key={material.id} value={material.name}>{material.name}</option>
                                        ))}
                                    </Select>
                                    <Label>
                                        Largura:
                                    </Label>
                                    <Input type="text" value={input.width} readOnly />
                                    <Label>
                                        Comprimento:
                                    </Label>
                                    <Input type="text" value={input.length} readOnly />
                                    <Label>
                                        Quantidade:
                                    </Label>
                                    <Input type="number" value={input.amount} onChange={(e) => handleRawMaterialChange(index, 'amount', e.target.value)} />
                                    <Label>
                                        Horas Gastas:
                                    </Label>
                                    <Input type="number" value={input.hoursSpent} onChange={(e) => handleRawMaterialChange(index, 'hoursSpent', e.target.value)} />
                                </div>
                            ))}
                            <WrapperButton>
                                <ConfirmButton onClick={handleConfirmClose}>Confirmar</ConfirmButton>
                                <CloseOrderButton onClick={handleCancelClose}>Cancelar</CloseOrderButton>
                            </WrapperButton>
                        </>
                    )}
                </ModalContentOrder>
            </ModalOrder>
        </Container>
    );
};

export default BrowserWorkOrders;