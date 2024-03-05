import React from 'react';
import './ItemsPerPage.css';

const ItemsPerPage = ({ itemsPerPage, setItemsPerPage, loadingPage }) => {
    return (
        <div className="items-per-page-container">
            <label className="items-per-page-label">Items per page:</label>
            <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                disabled={loadingPage}
                className="items-per-page-dropdown"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
        </div>
    );
}

export default ItemsPerPage;