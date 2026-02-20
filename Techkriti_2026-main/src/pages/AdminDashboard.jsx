import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';


import './AdminDashboard.css';


// Table Header Component
const SortableHeader = ({ label, sortKey, filterKey = sortKey, sortConfig, onSort, filters, onFilterChange, inputType = 'text' }) => (
    <th>
        <div className="sort-header" onClick={() => onSort(sortKey)}>
            {label}
            <span className="sort-icon">
                {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
            </span>
        </div>
        <input 
            type={inputType}
            className="column-search" 
            placeholder={inputType === 'date' ? '' : `Search ${label}...`}
            value={filters[filterKey] || ''}
            onChange={(e) => onFilterChange(filterKey, e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent sort trigger
            style={inputType === 'date' ? { padding: '4px', width: '100%', boxSizing: 'border-box' } : {}}
        />
    </th>
);

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('users'); // 'users' or 'teams'
    const [selectedCompetition, setSelectedCompetition] = useState('All');
    
    const { currentUser } = useAuth();

    // Separate error states
    const [usersError, setUsersError] = useState(null);
    const [registrationsError, setRegistrationsError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            setLoading(true);

            // 1. Fetch Users
            try {
                const usersSnap = await getDocs(collection(db, "users"));
                const userList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(userList);
                setUsersError(null);
            } catch (error) {

                setUsersError(error.message);
            }

            // 2. Fetch Registrations
            try {
                const regSnap = await getDocs(collection(db, "registrations"));
                const regList = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setRegistrations(regList);
                setRegistrationsError(null);
            } catch (error) {

                setRegistrationsError(error.message);
            }

            setLoading(false);
        };

        fetchData();
    }, [currentUser]);

    // Derived Data
    const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    const uniqueCompetitions = ['All', ...new Set(registrations.map(r => r.eventName || r.eventId).filter(Boolean))];

    // Filtered Registrations based on selection
    const filteredRegistrations = selectedCompetition === 'All' 
        ? registrations 
        : registrations.filter(r => (r.eventName === selectedCompetition || r.eventId === selectedCompetition));

    // Sorting and Filtering State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});

    // Handle Sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle Filtering
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Helper: Format Date
    const formatDate = (date) => {
        if (!date) return '-';
        // Handle Firestore Timestamp
        if (date.toDate) return date.toDate().toLocaleDateString('en-GB'); // dd/mm/yyyy
        // Handle Date object or ISO string
        return new Date(date).toLocaleDateString('en-GB');
    };

    // Generic Data Processor
    const processData = (data) => {
        let processed = [...data];

        // 1. Filter
        Object.keys(filters).forEach(key => {
            let filterValue = filters[key]?.toLowerCase();
            if (filterValue) {
                processed = processed.filter(item => {
                    // special handling for nested/computed fields
                    let itemValue = '';
                    if (key === 'user.fullName' && userMap[item.userId]) itemValue = userMap[item.userId].fullName;
                    else if (key === 'user.email' && userMap[item.userId]) itemValue = userMap[item.userId].email;
                    else itemValue = item[key]; // Default direct access
                    
                    // Special filtering for Dates
                    if (key === 'createdAt' || key === 'registeredAt') {
                        // The date picker sends YYYY-MM-DD
                        // We need to convert itemValue (Timestamp/Date) to YYYY-MM-DD for comparison
                        try {
                            let dateObj = null;
                            if (itemValue && itemValue.toDate) dateObj = itemValue.toDate();
                            else if (itemValue) dateObj = new Date(itemValue);
                            
                            if (dateObj) {
                                // Format dateObj to YYYY-MM-DD local time to match input
                                const year = dateObj.getFullYear();
                                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const day = String(dateObj.getDate()).padStart(2, '0');
                                const formattedItemDate = `${year}-${month}-${day}`;
                                return formattedItemDate === filterValue;
                            }
                        } catch (e) {
                            return false; 
                        }
                    }

                    return String(itemValue || '').toLowerCase().includes(filterValue);
                });
            }
        });

        // 2. Sort
        if (sortConfig.key) {
            processed.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Special handling for derived fields in registrations view
                if (viewMode === 'teams') {
                    if (sortConfig.key === 'user.fullName') {
                        aValue = userMap[a.userId]?.fullName;
                        bValue = userMap[b.userId]?.fullName;
                    } else if (sortConfig.key === 'user.email') {
                         aValue = userMap[a.userId]?.email;
                         bValue = userMap[b.userId]?.email;
                    }
                }

                // Handle Timestamps/Dates for consistent comparison
                if (aValue && typeof aValue === 'object' && aValue.toDate) aValue = aValue.toDate();
                else if (aValue && (typeof aValue === 'string' || typeof aValue === 'number')) aValue = new Date(aValue);
                
                if (bValue && typeof bValue === 'object' && bValue.toDate) bValue = bValue.toDate();
                else if (bValue && (typeof bValue === 'string' || typeof bValue === 'number')) bValue = new Date(bValue);


                // Null handling
                if (!aValue) return 1;
                if (!bValue) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return processed;
    };

    // Stats
    const totalUsers = users.length;
    const totalRegistrations = registrations.length;
    const currentViewRegistrations = filteredRegistrations.length;

    // Processed Data for Display
    const processedUsers = viewMode === 'users' ? processData(users) : [];
    const processedRegistrations = viewMode === 'teams' ? processData(filteredRegistrations) : [];





    const exportToCSV = () => {
        let headers = [];
        let rows = [];
        const filename = viewMode === 'users' ? 'users_export.csv' : 'registrations_export.csv';

        // Use processed data for export to respect filters/sorts
        if (viewMode === 'users') {
            headers = ["Full Name", "Email", "Phone", "College", "Reference Code", "Profile Completed", "Joined At"];
            rows = processedUsers.map(user => [
                `"${user.fullName || ''}"`,
                `"${user.email || ''}"`,
                `"${user.phone || ''}"`,
                `"${user.college || ''}"`,
                `"${user.referralCode || ''}"`,
                `"${user.profileCompleted ? 'Yes' : 'No'}"`,
                `"${formatDate(user.createdAt)}"`
            ]);
        } else {
            headers = ["Event/Comp", "Team ID", "Type", "User Name", "User Email", "Role", "Status", "Registered At"];
            rows = processedRegistrations.map(r => {
                const user = userMap[r.userId] || {};
                return [
                    `"${r.eventName || r.eventId || ''}"`,
                    `"${r.teamId || '-'}"`,
                    `"${r.type || (r.teamId ? 'team' : 'individual')}"`,
                    `"${user.fullName || r.userId || ''}"`,
                    `"${user.email || ''}"`,
                    `"${r.role || '-'}"`,
                    `"${r.status || ''}"`,
                    `"${formatDate(r.registeredAt)}"`
                ];
            });
        }

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="loading-container">Loading Admin Data...</div>;

    return (
        <div className="admin-container">
            {/* Header */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-actions">
                    <button onClick={exportToCSV} className="btn btn-primary">
                        Export View
                    </button>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
                <div className="glass-card stat-card">
                    <h3>Total Users</h3>
                    {usersError ? (
                        <p className="stat-error">Error: {usersError}</p>
                    ) : (
                        <p className="stat-number">{totalUsers}</p>
                    )}
                </div>
                <div className="glass-card stat-card">
                    <h3>Total Registrations</h3>
                    {registrationsError ? (
                        <p className="stat-error">Error: {registrationsError}</p>
                    ) : (
                        <p className="stat-number">{totalRegistrations}</p>
                    )}
                </div>
                <div className="glass-card stat-card active">
                    <h3>{selectedCompetition === 'All' ? 'All Competitions' : selectedCompetition}</h3>
                    <p className="stat-number">{currentViewRegistrations}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="controls">
                {/* View Switcher */}
                <div className="view-switcher">
                    <button 
                        className={`view-btn ${viewMode === 'users' ? 'active' : ''}`}
                        onClick={() => {
                            setViewMode('users');
                            setSortConfig({ key: null, direction: 'asc' });
                            setFilters({});
                        }}
                    >
                        View Users
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'teams' ? 'active' : ''}`}
                        onClick={() => {
                            setViewMode('teams');
                            setSortConfig({ key: null, direction: 'asc' });
                            setFilters({});
                        }}
                    >
                        View Registrations
                    </button>
                </div>

                {/* Competition Filter (Only active for Teams View) */}
                {viewMode === 'teams' && (
                    <select 
                        className="competition-select"
                        value={selectedCompetition} 
                        onChange={(e) => setSelectedCompetition(e.target.value)}
                    >
                        {uniqueCompetitions.map(comp => (
                            <option key={comp} value={comp}>{comp}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Tables */}
            <div className="data-table-container">
                {viewMode === 'users' ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <SortableHeader label="Name" sortKey="fullName" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Email" sortKey="email" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Phone" sortKey="phone" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="College" sortKey="college" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Ref Code" sortKey="referralCode" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Joined At" sortKey="createdAt" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} inputType="date" />
                            </tr>
                        </thead>
                        <tbody>
                            {processedUsers.map((user, index) => (
                                <tr key={user.id || index}>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.college}</td>
                                    <td>{user.referralCode || '-'}</td>
                                    <td>{formatDate(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <SortableHeader label="Event" sortKey="eventName" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Team ID" sortKey="teamId" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="User Name" sortKey="user.fullName" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="User Email" sortKey="user.email" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Role" sortKey="role" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Status" sortKey="status" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} />
                                <SortableHeader label="Registered At" sortKey="registeredAt" sortConfig={sortConfig} onSort={handleSort} filters={filters} onFilterChange={handleFilterChange} inputType="date" />
                            </tr>
                        </thead>
                        <tbody>
                            {processedRegistrations.length > 0 ? processedRegistrations.map((reg, index) => {
                                const user = userMap[reg.userId] || {};
                                return (
                                    <tr key={reg.id || index}>
                                        <td>{reg.eventName || reg.eventId}</td>
                                        <td>
                                            {reg.teamId ? (
                                                <span className="badge badge-team">{reg.teamId}</span>
                                            ) : (
                                                <span className="badge badge-individual">Individual</span>
                                            )}
                                        </td>
                                        <td>{user.fullName || 'Unknown'}</td>
                                        <td>{user.email || 'Unknown'}</td>
                                        <td>{reg.role || '-'}</td>
                                        <td>{reg.status}</td>
                                        <td>{formatDate(reg.registeredAt)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: 'hsl(var(--color-text-muted))' }}>
                                        No registrations found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
