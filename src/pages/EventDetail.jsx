import {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Mail, Edit, Trash2, Plus, Type, AlignLeft } from 'lucide-react';
import { API_URL } from '../config';

const EventDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
    });

    const [attendeeEmail, setAttendeeEmail] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // const res = await axios.get(`http://localhost:5000/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const res = await axios.get(`${API_URL}/api/events/${id}`);
                setEvent(res.data);

                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    date: new Date(res.data.date).toISOString().slice(0, 16),
                });
            } catch (error) {
                console.error('Error fetching event details:',error);
            }
        };  
        fetchEvent();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
       try{
        const res = await axios.put(
            `http://localhost:5000/api/events/${id}`,
            formData, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvent(res.data);
        alert('Event updated successfully');
       }catch(error){
        console.error('Error updating event:',error);
        alert('Failed to update event. Please try again.');
       }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try{
                await axios.delete(
                    `http://localhost:5000/api/events/delete/${id}`,
                    { headers: { Authorization: `Bearer ${token}` },
                 });

                alert('Event deleted successfully');
                navigate('/dashboard'); // redirect to dashboard
            }catch(error){
                console.error('Error deleting event:',error);
                alert('Failed to delete event. Please try again.');
            }
        }
    };

    const handleAddAttendee = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.put(
                `http://localhost:5000/api/events/add/${id}`,
                { attendee: attendeeEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvent(res.data);
            alert('Attendee added successfully');
            setAttendeeEmail('');
        }catch(error){
            console.error('Error adding attendee:',error);
            alert('Failed to add attendee. Please try again.');
        }
    };

    if(!event){
        return <p>Loading event details...</p>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Event Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8">
            <h2 className="text-3xl font-bold text-white">{event.name}</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-gray-700 text-lg">{event.description}</p>
            
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              <span>{new Date(event.date).toLocaleString()}</span>
            </div>
            
            <div className="flex items-start">
              <Users className="w-5 h-5 mr-2 text-purple-500 mt-1" />
              <div>
                <div className="font-medium text-gray-900 mb-2">Attendees</div>
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((attendee, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm">
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Event Form */}
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <AlignLeft className="w-4 h-4 mr-2 text-purple-500" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition duration-200"
            >
              Update Event
            </button>
          </form>
        </div>

        {/* Add Attendee Form */}
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
              <input
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter attendee's email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition duration-200"
            >
              Add Attendee
            </button>
          </form>
        </div>

        {/* Delete Event Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Event
          </button>
        </div>
      </div>
    </div>
    );

}

export default EventDetail;