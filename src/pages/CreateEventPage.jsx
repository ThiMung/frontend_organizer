import { useState } from 'react';
import { MapPin, Tag, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createOrganizerEvent } from '../services/eventService';

const CATEGORIES = ['Music', 'Sports', 'Food & Drink', 'Arts', 'Education', 'Community'];

const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800';

const CLOUDINARY_CONFIG = {
  cloudName: 'YOUR_CLOUDINARY_CLOUD_NAME',
  uploadPreset: 'YOUR_PRESET_NAME',
};

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    location: '',
    date: '',
    time: '',
    capacity: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToCloud = async (file) => {
    const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;

    // Dùng ảnh mẫu khi chưa cấu hình Cloudinary thật.
    if (cloudName === 'YOUR_CLOUDINARY_CLOUD_NAME') {
      return DEFAULT_IMAGE_URL;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: data,
    });
    const fileData = await res.json();

    return fileData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        setIsUploadingCloud(true);
        uploadedImageUrl = await uploadToCloud(imageFile);
      }

      const combinedStartTime = `${formData.date} ${formData.time}`;

      const requestPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        start_time: combinedStartTime,
        capacity: Number.parseInt(formData.capacity, 10),
        image_url: uploadedImageUrl,
      };

      await createOrganizerEvent(requestPayload);

      toast.success('Event created successfully as a Draft!', { position: 'top-right' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event. Please verify your inputs.', { position: 'top-right' });
    } finally {
      setIsLoading(false);
      setIsUploadingCloud(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Toaster />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 w-full max-w-[620px] p-6 md:p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Event</h1>
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Event Name</label>
              <input
                type="text"
                placeholder="Enter event name"
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Event Description</label>
              <textarea
                rows="4"
                placeholder="Enter event description"
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Category</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800 appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(event) => updateField('category', event.target.value)}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Tag className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800"
                    value={formData.location}
                    onChange={(event) => updateField('location', event.target.value)}
                    required
                  />
                  <MapPin className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800 uppercase text-xs"
                    value={formData.date}
                    onChange={(event) => updateField('date', event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Time</label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full px-3 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800"
                    value={formData.time}
                    onChange={(event) => updateField('time', event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Capacity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800"
                  value={formData.capacity === 0 ? '' : formData.capacity}
                  onChange={(event) => updateField('capacity', event.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="font-semibold text-slate-700">Banner Image (Direct to Cloud)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer font-medium transition-colors border border-slate-200">
                  <Upload className="w-4 h-4" /> Choose Banner
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-slate-300" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 bg-[#F1F3F5] hover:bg-[#E9ECEF] text-slate-700 font-bold rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading || isUploadingCloud}
                className="px-6 py-3 bg-[#FFAE42] hover:bg-[#E6952B] text-slate-900 font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isUploadingCloud ? 'Uploading Cloud...' : isLoading ? 'Saving...' : 'Create Event'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
