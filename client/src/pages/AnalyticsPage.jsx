import { useState } from 'react';
import { useAuth } from "../auth/AuthContext";
import './AnalyticsPage.css';
import AppNavbar from '../components/AppNavbar';
import { getAnalyticsData } from '../services/analyticsService';

// Default number of results for all queries
const DEFAULT_RESULTS = 10;

// List of all available analytics queries and the endpoints to call
const QUERIES = [
    {
        id: 'highestAdmissionRate',
        title: 'Highest Admission Rates',
        description: 'Fields of study with the highest admission rates',
        endpoint: '/programs/highestAdmissionRate',
        icon: '📊'
    },
    {
        id: 'highestRoi',
        title: 'Best ROI Institutions',
        description: 'Top institutions with highest return on investment per cost',
        endpoint: '/insititutions/HighestRoi',
        icon: '💰'
    },
    {
        id: 'statePrograms',
        title: 'Average ROI by State',
        description: 'Average ROI for each program by state (min 5 samples)',
        endpoint: '/states/programs/avgRoi',
        icon: '🗺️'
    },
    {
        id: 'earningsGrowth',
        title: 'Highest Earnings Growth',
        description: 'Programs with highest average earnings growth (Year 1 to Year 2)',
        endpoint: '/programs/highestAvgEarn',
        icon: '📈'
    },
    {
        id: 'highestSalary',
        title: 'Highest Starting Salaries',
        description: 'Programs with highest average salary one year after graduation',
        endpoint: '/programs/highestSalary',
        icon: '💵'
    },
    {
        id: 'lowestRoi',
        title: 'Lowest ROI Programs',
        description: 'Programs with the lowest ROI scores',
        endpoint: '/programs/lowestRoi',
        icon: '📉'
    },
    {
        id: 'lowestSalary',
        title: 'Lowest Salaries',
        description: 'Programs with lowest average salary two years after graduation',
        endpoint: '/programs/lowestSalary',
        icon: '💸'
    },
    {
        id: 'topStateInstitution',
        title: 'Best Institution per State',
        description: 'Most profitable university in every state',
        endpoint: '/states/intitutions/highestRoi',
        icon: '🏆'
    },
    {
        id: 'topProgramInstitution',
        title: 'Best Institution per Program',
        description: 'Most profitable university for each field of study',
        endpoint: '/programs/intitutions/highestRoi',
        icon: '🎓'
    },
    {
        id: 'GPArankings',
        title: 'GPA Rankings',
        description: 'Rankings of users based on GPA',
        endpoint: '/users/averageGpa/:userId',
        icon: '📊'
    }
];

export default function AnalyticsPage() {
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(DEFAULT_RESULTS);
    const { user } = useAuth();

    // Get the data from the server for the selected query
    const fetchQueryResults = async (query, queryLimit) => {
        setLoading(true);
        setError(null);

        try {
            const url = queryLimit !== undefined ? `${query.endpoint}/${queryLimit}` : query.endpoint;
            const data = await getAnalyticsData(url);

            setResults(data || []);
        } catch (err) {
            console.error('Analytics error:', err);
            setError(err.message || 'Failed to load analytics data');
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    const handleQueryClick = (query) => {
        setSelectedQuery(query);
        setLimit(DEFAULT_RESULTS);

        // Handle special case for GPA rankings which needs user ID
        if (query.id === 'GPArankings' && user) {
            const endpoint = query.endpoint.replace(':userId', user.user_id);
            fetchQueryResults({ ...query, endpoint }, undefined);
        } else {
            fetchQueryResults(query, DEFAULT_RESULTS);
        }

    };


    // Limit the results between 1 and 1000
    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value);
        if (newLimit > 0 && newLimit <= 1000) {
            setLimit(newLimit);
        }
    };

    const handleRefresh = () => {
        if (selectedQuery) {
            fetchQueryResults(selectedQuery, limit);
        }
    };

    const renderResults = () => {
        if (!results) return <div className="no-results">No results found</div>;

        // Special rendering for GPA rankings
        if (selectedQuery.id === 'GPArankings') {
            const data = results;

            return (
                <div className="results-container">
                    <div className="results-header">
                        <h3>{selectedQuery.title}</h3>
                        <div className="results-controls">
                            <button onClick={() => setSelectedQuery(null)} className="btn-close">
                                Close
                            </button>
                        </div>
                    </div>

                    <p>You are at the {data.percentile_rank}% percentile</p>

                    <div className="gpa-line">
                        <div className="gpa-scale">
                            {[0, 1, 2, 3, 4].map((num) => (
                                <span key={num}>{num}</span>
                            ))}
                        </div>

                        <div className="gpa-bar">
                            <div className="point avg" style={{ left: `${(data.avg_gpa / 4) * 100}%` }}>
                                <span>Avg ({data.avg_gpa.toFixed(2)})</span>
                            </div>

                            <div className="point me" style={{ left: `${(data.user_gpa / 4) * 100}%` }}>
                                <span>You ({data.user_gpa.toFixed(2)})</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Generic table rendering for other queries
        if (!Array.isArray(results) || results.length === 0) {
            return <div className="no-results">No results found</div>;
        }

        const headers = Object.keys(results[0]);

        return (
            <div className="results-container">
                <div className="results-header">
                    <h3>{selectedQuery.title}</h3>
                    <div className="results-controls">
                        <label>
                            Limit:
                            <input
                                type="number"
                                value={limit}
                                onChange={handleLimitChange}
                                min="1"
                                max="1000"
                            />
                        </label>
                        <button onClick={handleRefresh} className="btn-refresh">
                            Refresh
                        </button>
                        <button onClick={() => setSelectedQuery(null)} className="btn-close">
                            Close
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                {headers.map((header) => (
                                    <th key={header}>{formatHeader(header)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    {headers.map((header) => (
                                        <td key={header}>{formatValue(header, row[header])}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };



    const formatHeader = (header) => {
        return header
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatValue = (header, value) => {
        if (value === null || value === undefined) return 'N/A';

        // Format currency fields
        if (header.includes('salary') || header.includes('earn') || header.includes('COSTT')) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }

        // Format percentage fields
        if (header.includes('admission') || header.includes('rate')) {
            return `${(value * 100).toFixed(2)}%`;
        }

        // Format decimal numbers
        if (typeof value === 'number' && !Number.isInteger(value)) {
            return value.toFixed(2);
        }

        return value;
    };

    return (
        <div>
            <AppNavbar />

            <div className="analytics-page">
                <div className="analytics-header">
                    <h1>Analytics Dashboard</h1>
                    <p>Explore comprehensive insights about institutions and programs</p>
                </div>

                {!selectedQuery ? (
                    <div className="query-grid">
                        {QUERIES.map((query) => (
                            <div
                                key={query.id}
                                className="query-card"
                                onClick={() => handleQueryClick(query)}
                            >
                                <div className="query-icon">{query.icon}</div>
                                <h3>{query.title}</h3>
                                <p>{query.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="results-section">
                        {loading && (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Loading data...</p>
                            </div>
                        )}

                        {error && (
                            <div className="error">
                                <p>Error: {error}</p>
                                <button onClick={() => setSelectedQuery(null)}>Go Back</button>
                            </div>
                        )}

                        {!loading && !error && renderResults()}
                    </div>
                )}
            </div>
        </div>
    );
}