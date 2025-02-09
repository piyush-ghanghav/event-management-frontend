import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Calendar, 
    Users, 
    Mail, 
    Edit, 
    Trash2, 
    Plus, 
    Type, 
    AlignLeft, 
    MapPin, 
    User,
    Clock,
    Eye,
    EyeOff,
    UserPlus,
    LogIn,
    ArrowLeft
} from 'lucide-react';
import { API_URL } from '../config';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
    });
    const [attendeeEmail, setAttendeeEmail] = useState('');
    const [creator, setCreator] = useState(null);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showAddAttendeeForm, setShowAddAttendeeForm] = useState(false);

    const token = localStorage.getItem('token');
    const currentUser = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

    const isOwner = event?.owner === currentUser;
    const isAttending = event?.attendees.some(a => a.userId === currentUser);
    const isAuthenticated = !!token;

    useEffect(() => {
        const fetchEventAndCreator = async () => {
            try {
                setLoading(true);
                const eventRes = await axios.get(`${API_URL}/api/events/${id}`);
                setEvent(eventRes.data);
                
                setCreator(eventRes.data.owner);
                console.log('Creator',eventRes.data.owner.username);

                setFormData({
                    name: eventRes.data.name,
                    description: eventRes.data.description,
                    date: new Date(eventRes.data.date).toISOString().slice(0, 16),
                    location: eventRes.data.location,
                    category: eventRes.data.category,
                    isPrivate: eventRes.data.isPrivate
                });
            } catch (error) {
                setError('Failed to load event details');
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndCreator();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${API_URL}/api/events/update/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent(res.data);
            alert('Event updated successfully');
            setShowUpdateForm(false); 
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event. Please try again.');
        }
    };

    const handleDelete = async () => {
        
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(
                    `${API_URL}/api/events/delete/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert('Event deleted successfully');
                navigate('/dashboard');
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event. Please try again.');
            }
        }
    };

    const handleAttend = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/event/${id}` } });
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/api/events/join/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent(res.data);
            console.log('Attending event:', res.data);
            alert('Successfully registered for the event!');
        } catch (error) {
            console.error('Error attending event:', error);
            alert('Failed to register for the event. Please try again.');
        }
    };

    const handleAddAttendee = async (e) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!token) {
            navigate('/login', { state: { from: `/event/${id}` } });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(attendeeEmail)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const res = await axios.put(
                `${API_URL}/api/events/add/${id}`,
                { attendee: attendeeEmail },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            // Update the event state with new data
            setEvent(res.data);
            alert('Attendee added successfully');
            setAttendeeEmail('');
            setShowAddAttendeeForm(false);
            navigate(`/event/${id}`);
        } catch (error) {
            console.error('Error adding attendee:', error);
            if (error.response?.status === 401) {
                alert('Your session has expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Failed to add attendee. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error || 'Event not found'}</div>
            </div>
        );
    }

    // If event is private and user is not authenticated or not the owner, show restricted access
    if (event.isPrivate && !isAuthenticated && !isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">This is a private event</h2>
                    <p className="text-gray-600">Please log in to view the details</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Log In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back to Dashboard Button */}
                <div className="flex justify-start">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition duration-200 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Event Details Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8 relative">
                        {event.isPrivate ? (
                            <span className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Private Event
                            </span>
                        ) : (
                            <span className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                Public Event
                            </span>
                        )}
                        <h2 className="text-3xl font-bold text-white">{event.name}</h2>
                        <div className="mt-2 text-white opacity-90 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Created by {creator?.username || 'Unknown'}
                        </div>
                        {event.contactEmail && (
                            <div className="mt-2 text-white opacity-90 flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                <a href={`mailto:${event.contactEmail}`} className="hover:underline">
                                    {event.contactEmail}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start space-x-2">
                            <AlignLeft className="w-5 h-5 text-purple-500 mt-1" />
                            <p className="text-gray-700 text-lg flex-1">{event.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                                    <span>{new Date(event.date).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                                    <span>{event.location}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <Type className="w-5 h-5 mr-2 text-purple-500" />
                                    <span className="capitalize">{event.category}</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between">
                                <div className="flex items-start">
                                    <Users className="w-5 h-5 mr-2 text-purple-500 mt-1" />
                                    <div>
                                        <div className="font-medium text-gray-900 mb-2">
                                            Attendees ({event.attendees.length})
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {event.attendees.map((attendee, index) => (
                                                <span 
                                                    key={index} 
                                                    className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm"
                                                >
                                                    {/* Display email or username if available */}
                                                    {attendee.email || (attendee.userId && attendee.userId.username) || 'Unknown'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {!isOwner && !isAttending && (
                                    <button
                                        onClick={handleAttend}
                                        className="mt-4 w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center"
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {isAuthenticated ? 'Attend Event' : 'Login to Attend'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Show Update and Add Attendee forms only for event owner */}
                {isOwner && (
                    <>
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="space-x-4">
                                <button
                                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                                    className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition duration-200"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {showUpdateForm ? 'Cancel Update' : 'Update Event'}
                                </button>
                                <button
                                    onClick={() => setShowAddAttendeeForm(!showAddAttendeeForm)}
                                    className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition duration-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    {showAddAttendeeForm ? 'Cancel Adding' : 'Add Attendee'}
                                </button>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-200"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Event
                            </button>
                        </div>

                        {/* Update Event Form */}
                        {showUpdateForm && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Edit className="w-5 h-5 mr-2 text-purple-500" />
                                    Update Event
                                </h3>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <Type className="w-4 h-4 mr-2 text-purple-500" />
                                            Event Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <AlignLeft className="w-4 h-4 mr-2 text-purple-500" />
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                            Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isPrivate"
                                            checked={formData.isPrivate}
                                            onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Make this event private</label>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-200"
                                        >
                                            Update Event
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Add Attendee Form */}
                        {showAddAttendeeForm && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Plus className="w-5 h-5 mr-2 text-purple-500" />
                                    Add Attendee
                                </h3>
                                <form onSubmit={handleAddAttendee} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700">
                                            <Mail className="w-4 h-4 mr-2 text-purple-500" />
                                            Attendee Email
                                        </label>
                                        <div className="flex space-x-2">
                                            <input
                                                type="email"
                                                value={attendeeEmail}
                                                onChange={(e) => setAttendeeEmail(e.target.value)}
                                                placeholder="Enter email address"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-200"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventDetail;