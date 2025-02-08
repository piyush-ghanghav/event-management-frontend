import {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Type, AlignLeft } from 'lucide-react';
import { API_URL } from '../config';



const EventForm = () => {
    const [name, setName] = useState('');   
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');   
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');

            // eslint-disable-next-line
            const res = await axios.post(
                `${API_URL}/api/events/create`, 
                {name, description, date}, 
                {headers: {Authorization: `Bearer ${token}`}}
            );

            navigate('/dashboard'); // redirect to dashboard
        }
        catch(error){
            console.log(error);
            setError(error.response.data.error || 'Event creation failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-8">
                <h2 className="text-3xl font-bold text-white">Create New Event</h2>
                <p className="mt-2 text-purple-100">Fill in the details to create your event</p>
              </div>
    
              {/* Form Section */}
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
                      Event Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      placeholder="Enter event name"
                    />
                  </div>
    
                  {/* Description Field */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <AlignLeft className="w-4 h-4 mr-2 text-purple-500" />
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 resize-none"
                      placeholder="Describe your event"
                    />
                  </div>
    
                  {/* Date & Time Field */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    />
                  </div>
    
                  {/* Form Actions */}
                  <div className="pt-6 flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
                    >
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
    
            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Need help? Check out our{' '}
              <a href="/guidelines" className="text-purple-600 hover:text-purple-500 font-medium">
                event creation guidelines
              </a>
            </div>
          </div>
        </div>
      );
};

export default EventForm;