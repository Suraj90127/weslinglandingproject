import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import { createPlayer, updatePlayer, fetchPlayers } from '../../redux/slices/playerSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AddPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { players, loading } = useSelector((state) => state.players);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (id && players.length > 0) {
      const player = players.find(p => p._id === id);
      if (player) {
        setValue('name', player.name);
        setValue('ringName', player.ringName);
        setValue('nativePlace', player.nativePlace);
        setValue('profession', player.profession);
        setValue('height', player.height);
        setValue('weight', player.weight);
        setValue('chest', player.chest);
        setValue('biceps', player.biceps);
        setValue('age', player.age);
        setValue('matchesWon', player.matchesWon);
        setValue('isActive', player.isActive);

        // Social Media
        if (player.socialMedia) {
          setValue('socialMedia.instagram', player.socialMedia.instagram || '');
          setValue('socialMedia.facebook', player.socialMedia.facebook || '');
          setValue('socialMedia.youtube', player.socialMedia.youtube || '');
        }

        // Contact
        if (player.contact) {
          setValue('contact.phone', player.contact.phone || '');
          setValue('contact.email', player.contact.email || '');
          setValue('contact.address', player.contact.address || '');
        }

        setPreviewImage(player.image);
      }
    }
  }, [id, players, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Basic info
      formData.append('name', data.name);
      formData.append('ringName', data.ringName || '');
      formData.append('nativePlace', data.nativePlace || '');
      formData.append('profession', data.profession || '');
      formData.append('height', data.height || '');
      formData.append('weight', data.weight || '');
      formData.append('chest', data.chest || '');
      formData.append('biceps', data.biceps || '');
      formData.append('age', data.age || '');
      formData.append('matchesWon', parseInt(data.matchesWon) || 0);
      formData.append('isActive', data.isActive);

      // Social Media
      const socialMedia = {
        instagram: data.socialMedia?.instagram || '',
        facebook: data.socialMedia?.facebook || '',
        youtube: data.socialMedia?.youtube || ''
      };
      formData.append('socialMedia', JSON.stringify(socialMedia));


      // Contact
      const contact = {
        phone: data.contact?.phone || '',
        email: data.contact?.email || '',
        address: data.contact?.address || ''
      };
      formData.append('contact', JSON.stringify(contact));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (id) {
        await dispatch(updatePlayer({ id, payload: formData })).unwrap();
        toast.success('Player updated successfully');
      } else {
        await dispatch(createPlayer(formData)).unwrap();
        toast.success('Player created successfully');
      }

      navigate('/players');
    } catch (error) {
      toast.error(error || 'Operation failed');
    }
  };



  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/players')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? 'Edit Player' : 'Add New Player'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Update player information' : 'Add a new player to your team'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="Enter player name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Ring Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ring Name
              </label>
              <input
                type="text"
                {...register('ringName')}
                className="input-field"
                placeholder="Enter ring name"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession
              </label>
              <input
                type="text"
                {...register('profession')}
                className="input-field"
                placeholder="e.g., Wrestler"
              />
            </div>

            {/* Native Place */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Native Place
              </label>
              <input
                type="text"
                {...register('nativePlace')}
                className="input-field"
                placeholder="e.g., Parts Unknown"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                {...register('age')}
                className="input-field"
                placeholder="Age"
                min="16"
                max="80"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              <input
                type="text"
                {...register('height')}
                className="input-field"
                placeholder="e.g., 6'2\&quot;"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                {...register('weight')}
                className="input-field"
                placeholder="e.g., 250 lbs"
              />
            </div>

            {/* Chest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chest
              </label>
              <input
                type="text"
                {...register('chest')}
                className="input-field"
                placeholder="e.g., 52 inches"
              />
            </div>

            {/* Biceps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biceps
              </label>
              <input
                type="text"
                {...register('biceps')}
                className="input-field"
                placeholder="e.g., 20 inches"
              />
            </div>

            {/* Matches Won */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matches Won
              </label>
              <input
                type="number"
                {...register('matchesWon')}
                className="input-field"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked={true}
              />
              <label className="ml-2 block text-sm text-gray-700">
                Active Player
              </label>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                {...register('socialMedia.instagram')}
                className="input-field"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                {...register('socialMedia.facebook')}
                className="input-field"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                {...register('socialMedia.youtube')}
                className="input-field"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('contact.phone')}
                className="input-field"
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('contact.email')}
                className="input-field"
                placeholder="player@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                {...register('contact.address')}
                rows="2"
                className="input-field"
                placeholder="Full address"
              />
            </div>
          </div>
        </div>

        {/* Player Image */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Player Photo</h2>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
            <div className="space-y-1 text-center">
              {previewImage ? (
                <div className="relative">
                  <img
                    src={getImageUrl(previewImage)}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Upload a photo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/players')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <FiSave className="mr-2" size={18} />
            )}
            {id ? 'Update Player' : 'Create Player'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayer;