import { createContext, useContext, useState, useEffect } from 'react';
import { mockInventory, mockConsumerData } from '../data/mockData';

const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
    // Helper to load from localStorage
    const loadState = (key, fallback) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    };

    // Shared inventory for warehouse manager
    const [warehouseInventory, setWarehouseInventory] = useState(() => loadState('warehouseInventory', mockInventory));
    
    // Shared stock for the farmer/consumer
    const [consumerStock, setConsumerStock] = useState(() => loadState('consumerStock', mockConsumerData.myStock));

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('warehouseInventory', JSON.stringify(warehouseInventory));
    }, [warehouseInventory]);

    useEffect(() => {
        localStorage.setItem('consumerStock', JSON.stringify(consumerStock));
    }, [consumerStock]);

    // Function for manager to add stock on behalf of a farmer
    const addStockToFarmer = (farmerDetails) => {
        const newStockId = Date.now().toString();
        
        // 1. Add to Warehouse inventory
        const newInventoryItem = {
            _id: newStockId,
            name: farmerDetails.commodity,
            category: farmerDetails.category || 'Grains',
            location: farmerDetails.location || 'Silo A',
            quantity: farmerDetails.quantity,
            unit: farmerDetails.unit || 'tons',
            qualityStatus: 'Good',
            lastChecked: new Date().toISOString(),
            temperature: 20 + Math.random() * 5,
            humidity: 50 + Math.random() * 10,
            farmerName: farmerDetails.farmerName // Link to farmer
        };
        
        setWarehouseInventory(prev => [newInventoryItem, ...prev]);

        // 2. Add to Consumer's stock view
        const newConsumerItem = {
            _id: newStockId,
            name: farmerDetails.commodity,
            location: farmerDetails.location || 'Silo A',
            quantity: farmerDetails.quantity,
            quality: 'Good',
            storageCost: 150,
            storedSince: new Date().toISOString()
        };

        setConsumerStock(prev => [newConsumerItem, ...prev]);

        return newStockId;
    };

    return (
        <StorageContext.Provider value={{ 
            warehouseInventory, 
            consumerStock, 
            addStockToFarmer 
        }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};
