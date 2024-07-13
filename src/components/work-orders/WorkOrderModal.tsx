import React, { useState } from 'react';
import styled from 'styled-components';
import { doc, updateDoc } from 'firebase/firestore';
import firestore from '../../firebaseConfig';

interface Item {
    name: string;
    quantity: number;
}

interface WorkOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    workOrderId: string;
    rawMaterials: Item[];
    materials: Item[];
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-width: 100%;
`;

const Title = styled.h2`
    margin-top: 0;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 8px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const Button = styled.button`
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background-color: ${(props) => props.theme.colors.secondary};
    }
`;

const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ isOpen, onClose, workOrderId, rawMaterials, materials }) => {
    const [localRawMaterials, setLocalRawMaterials] = useState<Item[]>(rawMaterials);
    const [localMaterials, setLocalMaterials] = useState<Item[]>(materials);

    const handleSave = async () => {
        try {
            const workOrderRef = doc(firestore, 'workOrders', workOrderId);
            await updateDoc(workOrderRef, {
                rawMaterialsUsed: JSON.stringify(localRawMaterials),
                materialsUsed: JSON.stringify(localMaterials),
            });
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar ordem de serviço:', error);
        }
    };

    const handleRawMaterialChange = (index: number, quantity: number) => {
        const newRawMaterials = [...localRawMaterials];
        newRawMaterials[index].quantity = quantity;
        setLocalRawMaterials(newRawMaterials);
    };

    const handleMaterialChange = (index: number, quantity: number) => {
        const newMaterials = [...localMaterials];
        newMaterials[index].quantity = quantity;
        setLocalMaterials(newMaterials);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Overlay>
            <ModalContainer>
                <Title>Editar Materiais e Matérias-Primas</Title>
                <Form>
                    <div>
                        <h3>Matérias-Primas</h3>
                        {localRawMaterials.map((item, index) => (
                            <Label key={index}>
                                {item.name}
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleRawMaterialChange(index, parseInt(e.target.value))}
                                />
                            </Label>
                        ))}
                    </div>
                    <div>
                        <h3>Materiais</h3>
                        {localMaterials.map((item, index) => (
                            <Label key={index}>
                                {item.name}
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleMaterialChange(index, parseInt(e.target.value))}
                                />
                            </Label>
                        ))}
                    </div>
                    <Button type="button" onClick={handleSave}>Salvar</Button>
                    <Button type="button" onClick={onClose} style={{ backgroundColor: '#ccc', color: '#000' }}>Cancelar</Button>
                </Form>
            </ModalContainer>
        </Overlay>
    );
};

export default WorkOrderModal;
