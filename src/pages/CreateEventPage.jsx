import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Users, MapPin, Tag, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';

const CreateEventPage = () => {
  const navigate = useNavigate();

  // State quản lý toàn bộ form dữ liệu
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music', // Giá trị mặc định nằm trong enum
    location: '',
    date: '',
    time: '',
    capacity: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);

  // Hàm xử lý chọn file ảnh và chuẩn bị upload lên Cloud
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Hàm upload trực tiếp lên Cloud (Sử dụng API Unsigned Upload của Cloudinary làm mẫu chuẩn)
  const uploadToCloud = async (file) => {
    const cloudName = "YOUR_CLOUDINARY_CLOUD_NAME"; // Thay bằng Cloud Name của bạn nếu có
    const uploadPreset = "YOUR_PRESET_NAME";       // Thay bằng Upload Preset của bạn

    // Nếu bạn chưa cấu hình Cloudinary thật, hàm này sẽ trả về một ảnh Unsplash ngẫu nhiên cực đẹp để chạy thử nghiệm
    if (cloudName === "YOUR_CLOUDINARY_CLOUD_NAME") {
      return `https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800`;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: data
    });
    const fileData = await res.json();
    return fileData.secure_url; // Trả về link https của ảnh lưu trên mây
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        setIsUploadingCloud(true);
        uploadedImageUrl = await uploadToCloud(imageFile);
        setIsUploadingCloud(false);
      }

      // Gộp trường Ngày (Date) và Giờ (Time) thành định dạng ISO trùng khớp start_time của Backend
      const combinedStartTime = `${formData.date} ${formData.time}`;

      const requestPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        start_time: combinedStartTime,
        capacity: parseInt(formData.capacity, 10),
        image_url: uploadedImageUrl, // Đường dẫn ảnh Cloud bọc vào JSON gửi đi
      };

      // Gửi request lên endpoint lưu trữ sự kiện của Laravel
      await api.post('/events', requestPayload);

      toast.success('Event created successfully as a Draft!', { position: 'top-right' });
      
      // Chuyển hướng về trang danh sách quản lý của Organizer sau 1.5s
      setTimeout(() => {
        navigate('/organizer/dashboard');
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event. Please verify your inputs.', { position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Toaster />
      
      {/* 1. THANH NAVBAR PHÍA TRÊN ĐƯỢC GIỮ NGUYÊN (MẪU) */}
      <nav className="w-full bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl text-indigo-600 tracking-tight">EventHub</span>
          <span className="text-xs bg-slate-100 font-bold text-slate-500 px-2 py-0.5 rounded uppercase">Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 font-medium">Hello, Organizer</span>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">O</div>
        </div>
      </nav>

      {/* 2. PHẦN KHUNG FORM CHỨA NỘI DUNG TẠO SỰ KIỆN GIỐNG ẢNH MẪU */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 w-full max-w-[620px] p-6 md:p-8 relative">
          
          {/* Header kèm Nút Close X đúng vị trí */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Event</h1>
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            
            {/* Trường Event Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Event Name</label>
              <input
                type="text"
                placeholder="Enter event name"
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Trường Event Description */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Event Description</label>
              <textarea
                rows="4"
                placeholder="Enter event description"
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Hàng 2 cột: Category & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Category</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800 appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Food & Drink">Food & Drink</option>
                    <option value="Arts">Arts</option>
                    <option value="Education">Education</option>
                    <option value="Community">Community</option>
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
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  <MapPin className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Hàng 3 cột: Date, Time & Capacity chuẩn tỉ lệ ảnh cung cấp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-3 py-3 bg-[#F8F9FA] border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-slate-800 uppercase text-xs"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Vùng chọn ảnh tải lên Cloud (Tự động lưu dạng URL) */}
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

            {/* Khu vực 2 nút nhấn: Cancel và Create Event với mã màu cam đặc trưng chuẩn xác */}
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