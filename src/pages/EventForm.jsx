import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Calendar, 
    Type, 
    AlignLeft, 
    MapPin, 
    Tag, 
    Eye, 
    EyeOff, 
    Image as ImageIcon,
    ArrowLeft,
    Users,
    PlusCircle,
    X
} from 'lucide-react';
import { API_URL } from '../config';

const EventForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        category: '',
        imageUrl: '',
        isPrivate: false,
        attendees: []
    });
    const [attendeeEmail, setAttendeeEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddAttendee = (e) => {
        e.preventDefault();
        if (!attendeeEmail) return;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(attendeeEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.attendees.includes(attendeeEmail)) {
            setError('This email is already added');
            return;
        }

        setFormData(prev => ({
            ...prev,
            attendees: [...prev.attendees, attendeeEmail]
        }));
        setAttendeeEmail('');
        setError('');
    };

    const removeAttendee = (emailToRemove) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees.filter(email => email !== emailToRemove)
        }));
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // Validate date is not in the past
            if (new Date(formData.date) < new Date()) {
                setError('Event date cannot be in the past');
                return;
            }

            // Format attendees according to the Event model schema
            const eventData = {
                ...formData,
                attendees: formData.attendees.map(email => ({
                    email: email,
                    registered: false,
                    userId: null
                }))
            };

            const res = await axios.post(
                `${API_URL}/api/events/create`, 
                eventData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data) {
                console.log('Event created:', res.data);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            setError(error.response?.data?.message || 'Event creation failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Back Button */}
                <div className="flex justify-start">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition duration-200 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8">
                        <h2 className="text-3xl font-bold text-white">Create New Event</h2>
                        <p className="mt-2 text-purple-100">Fill in the details to create your event</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateEvent} className="space-y-6">
                            {/* Event Name Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Type className="w-4 h-4 mr-2 text-purple-500" />
                                    Event Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter event name"
                                />
                            </div>

                            {/* Description Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <AlignLeft className="w-4 h-4 mr-2 text-purple-500" />
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    placeholder="Describe your event"
                                />
                            </div>

                            {/* Date & Time Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Location Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter event location"
                                />
                            </div>

                            {/* Category Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Tag className="w-4 h-4 mr-2 text-purple-500" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="">Select a category</option>
                                    <option value="conference">Conference</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="social">Social</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Image URL Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <ImageIcon className="w-4 h-4 mr-2 text-purple-500" />
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter image URL"
                                />
                            </div>

                            {/* Privacy Setting */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isPrivate"
                                    checked={formData.isPrivate}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    {formData.isPrivate ? (
                                        <EyeOff className="w-4 h-4 mr-2 text-purple-500" />
                                    ) : (
                                        <Eye className="w-4 h-4 mr-2 text-purple-500" />
                                    )}
                                    Make this event private
                                </label>
                            </div>

                            {/* Attendees Field */}
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                                    Attendees
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="email"
                                        value={attendeeEmail}
                                        onChange={(e) => setAttendeeEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Enter attendee email"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAttendee}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {formData.attendees.map((email, index) => (
                                        <div key={index} className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg">
                                            <span>{email}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttendee(email)}
                                                className="text-red-500 hover:text-red-700 transition duration-200"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="pt-6 flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventForm;