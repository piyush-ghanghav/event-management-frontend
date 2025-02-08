import {useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {Link} from 'react-router-dom';
import { API_URL } from '../config';
import { Calendar, Users, Clock, Plus } from 'lucide-react';

const Dashboard = () =>{
    const [events, setEvents] = useState([]);
    // eslint-disable-next-line
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events/all`);
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();

        //Connect to Socket.IO server
        const socketClient = io(API_URL);
        setSocket(socketClient);

        //Listening for events
        socketClient.on('new-event', (data) => {
            setEvents((prevEvents) => [...prevEvents, data]);
        });

        //Listen for attendee updates
        socketClient.on('update-attendees', (data) => {
            setEvents((prevEvents) => 
                prevEvents.map((event) => 
                    event.id === data.id ? { ...event, attendees: data.attendees } : event
                )
            );
        });

        return () => socketClient.disconnect();
    }, []);

    return(
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-900">Your Events Dashboard</h2>
            <Link
              to="/event/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Event Image Placeholder */}
              <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold truncate">{event.name}</h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 line-clamp-2 h-12">{event.description}</p>
                
                <div className="space-y-3">
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
                  <Link 
                    to={`/event/${event._id}/add-attendee`}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Attendee
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started!</p>
              <Link
                to="/event/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Event
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
    );
};

export default Dashboard;