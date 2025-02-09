import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { 
    Calendar, 
    Users, 
    Clock, 
    Plus, 
    Search, 
    Filter, 
    Grid, 
    List, 
    MapPin, 
    Tag, 
    Eye, 
    EyeOff,
    AlertTriangle 
} from 'lucide-react';

const Dashboard = () => {
    // State
    const [events, setEvents] = useState([]);
    const [socket, setSocket] = useState(null);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        date: '',
        isPrivate: false
    });
    const [sortBy, setSortBy] = useState('date');
    const [userStats, setUserStats] = useState({
        hosting: 0,
        attending: 0,
        upcoming: 0
    });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const currentUser = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

    const isEventOwner = (event) => {
        return currentUser && event.owner === currentUser;
    };

    // Utilities
    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === date.toDateString();
        
        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';
        
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeFromDate = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Effects
    useEffect(() => {
        
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/api/events/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEvents(response.data);
                
                // Calculate stats
                const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;
                if (userId) {
                    console.log(response.data);
                    setUserStats({
                        hosting: response.data.filter(e => e.owner._id === userId).length,
                        attending: response.data.filter(e => e.attendees.some(a => a.userId === userId)).length,
                        upcoming: response.data.filter(e => new Date(e.date) > new Date()).length
                    });
                }
            } catch (error) {
                setError('Failed to fetch events. Please try again later.');
                console.error('Error fetching events:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchEvents();
        setupSocketConnection();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [token, navigate]);

    const setupSocketConnection = () => {
        if (!token) return;
        
        const socketClient = io(API_URL, {
            auth: {
                token
            }
        });
        
        setSocket(socketClient);
        
        socketClient.on('new-event', (data) => {
            setEvents(prevEvents => [...prevEvents, data]);
        });
        
        socketClient.on('update-event', (data) => {
            setEvents(prevEvents => 
                prevEvents.map(event => 
                    event._id === data._id ? data : event
                )
            );
        });
        
        socketClient.on('delete-event', (eventId) => {
            setEvents(prevEvents => 
                prevEvents.filter(event => event._id !== eventId)
            );
        });

        return () => socketClient.disconnect();
    };
    console.log(userStats);
    
    // Filter and sort events
    const filteredEvents = events
        .filter(event => {
            const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
                               event.description.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = !filters.category || event.category === filters.category;
            const matchesDate = !filters.date || new Date(event.date).toDateString() === new Date(filters.date).toDateString();
            const matchesPrivacy = !filters.isPrivate || event.isPrivate === filters.isPrivate;
            
            return matchesSearch && matchesCategory && matchesDate && matchesPrivacy;
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'date':
                    return new Date(a.date) - new Date(b.date);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'popularity':
                    return b.attendees.length - a.attendees.length;
                default:
                    return 0;
            }
        });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500" />
            </div>
        );
    }

    // Add isAuthenticated check
    const isAuthenticated = !!token;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Header with Stats - Only show for authenticated users */}
            {isAuthenticated ? (
                <div className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h2>
                                <Link
                                    to="/event/new"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create New Event
                                </Link>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-purple-700">Events Hosting</h3>
                                    <p className="text-2xl font-bold text-purple-900">{userStats.hosting}</p>
                                </div>
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-700">Events Attending</h3>
                                    <p className="text-2xl font-bold text-blue-900">{userStats.attending}</p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-700">Upcoming Events</h3>
                                    <p className="text-2xl font-bold text-purple-900">{userStats.upcoming}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Guest header
                <div className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-gray-900">Event Dashboard</h2>
                            <div className="flex gap-4">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 font-medium rounded-lg hover:bg-purple-200 transition duration-200"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                <option value="Test Category">Test Category</option>
                                <option value="conference">Conference</option>
                                <option value="workshop">Workshop</option>
                                <option value="social">Social</option>
                            </select>

                            <button
                                onClick={() => setFilters({...filters, isPrivate: !filters.isPrivate})}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${
                                    filters.isPrivate ? 'bg-purple-100 border-purple-300' : 'border-gray-300'
                                }`}
                            >
                                {filters.isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {filters.isPrivate ? 'Private Only' : 'All Events'}
                            </button>

                            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-2 rounded ${view === 'grid' ? 'bg-purple-100' : ''}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded ${view === 'list' ? 'bg-purple-100' : ''}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                </div>
            )}

            {/* Events Grid/List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                          
                            <div
                                key={event._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative">
                                    {event.imageUrl && (
                                        <img 
                                            src={event.imageUrl} 
                                            alt={event.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {event.isPrivate && (
                                            <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                                <EyeOff className="w-3 h-3 mr-1" />
                                                Private
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white text-xl font-bold truncate">{event.name}</h3>
                                        <p className="text-white text-sm opacity-90">
                                            Organiser: {event.owner?.username || 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <p className="text-gray-600 line-clamp-2 h-12">{event.description}</p>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                                            <span>{formatEventDate(event.date)}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-gray-700">
                                            <Clock className="w-5 h-5 mr-2 text-purple-500" />
                                            <span>{getTimeFromDate(event.date)}</span>
                                        </div>

                                        <div className="flex items-center text-gray-700">
                                            <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                                            <span className="truncate">{event.location}</span>
                                        </div>

                                        <div className="flex items-center text-gray-700">
                                            <Tag className="w-5 h-5 mr-2 text-purple-500" />
                                            <span>{event.category}</span>
                                        </div>

                                        <div className="flex items-center text-gray-700">
                                            <Users className="w-5 h-5 mr-2 text-purple-500" />
                                            <span>{event.attendees.length} attendees</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-between items-center">
                                        <Link 
                                            to={`/event/${event._id}`}
                                            className="text-purple-600 hover:text-purple-500 font-medium text-sm"
                                        >
                                            View Details
                                        </Link>
                                        {isEventOwner(event) && (
                                            <Link 
                                                to={`/event/${event._id}/add-attendee`}
                                                className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Attendee
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map((event) => (
                            <div 
                                key={event._id} 
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                                            <span className="text-sm text-gray-500">
                                                • Organiser: {event.owner?.username || 'Unknown'}
                                            </span>
                                            {event.isPrivate && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center">
                                                    <EyeOff className="w-3 h-3 mr-1" />
                                                    Private
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="flex items-center text-gray-700">
                                                <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                                                <span className="text-sm">{formatEventDate(event.date)}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700 mt-1">
                                                <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                                                <span className="text-sm">{event.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <Link 
                                                to={`/event/${event._id}`}
                                                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
                                            >
                                                View Details
                                            </Link>
                                            {isEventOwner(event) && (
                                                <Link 
                                                    to={`/event/${event._id}/add-attendee`}
                                                    className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors duration-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No events found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;