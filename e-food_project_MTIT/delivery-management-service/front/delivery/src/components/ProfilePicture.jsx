import React, { useRef, useState } from 'react';
import { authService } from '../services/authService.js';

const ProfilePicture = ({ 
  profilePicture, 
  isEditing, 
  onPictureUpload, 
  onError 
}) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(profilePicture);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      onError('Invalid file type. Please upload a JPEG, PNG, or GIF.');
      return;
    }

    if (file.size > maxSize) {
      onError('File size exceeds 5MB limit.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const token = localStorage.getItem('token');
      // Create FormData to send file
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Call service method to upload profile picture
      const uploadResponse = await authService.uploadProfilePicture(token, formData);
      
      // Call parent component's upload handler
      onPictureUpload(uploadResponse.profilePictureUrl);
    } catch (err) {
      onError(err.message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        {previewImage ? (
          <img 
            src={previewImage} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {isEditing && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;