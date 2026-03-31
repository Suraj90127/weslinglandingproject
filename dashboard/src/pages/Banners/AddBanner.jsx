import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi';
import { createBanner, updateBanner, fetchBanners } from '../../redux/slices/bannerSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const AddBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (id && banners.length > 0) {
      const banner = banners.find(b => b._id === id);
      if (banner) {
        setValue('name', banner.name);
        setValue('title', banner.title);
        setValue('description', banner.description || '');
        setValue('link', banner.link || '');
        setValue('position', banner.position);
        setValue('isActive', banner.isActive);
        setValue('pageType', banner.pageType || 'custom');
        setExistingImages(banner.images || []);
      }
    }
  }, [id, banners, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeExistingImage = (imagePath) => {
    setImagesToDelete(prev => [...prev, imagePath]);
    setExistingImages(prev => prev.filter(img => img !== imagePath));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Add form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      // Add new images
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      // Add images to delete (for update)
      if (imagesToDelete.length > 0) {
        formData.append('deleteImages', JSON.stringify(imagesToDelete));
      }

      // For update, decide whether to replace or append
      if (id) {
        formData.append('replaceImages', data.replaceImages === 'true');
        await dispatch(updateBanner({ id, formData })).unwrap();
        toast.success('Page/Banner updated successfully');
      } else {
        await dispatch(createBanner(formData)).unwrap();
        toast.success('Page/Banner created successfully');
      }

      navigate('/banners');
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const pageTypes = [
    'home', 'about', 'events', 'players', 'contact', 'gallery', 'sponsors', 'custom'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/banners')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? 'Edit Page/Banner' : 'Add New Page/Banner'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Update your page information' : 'Create a new page or banner for your website'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Page Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Page name is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Use lowercase letters, numbers, and hyphens only'
                  }
                })}
                className="input-field"
                placeholder="e.g., home, about-us, contact"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">This will be used in the URL: /banners/page/name</p>
            </div>

            {/* Page Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Type
              </label>
              <select
                {...register('pageType')}
                className="input-field"
              >
                {pageTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Position
              </label>
              <input
                type="number"
                {...register('position')}
                className="input-field"
                placeholder="0"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="Enter page title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="3"
                className="input-field"
                placeholder="Brief description for the page"
              />
            </div>

            {/* Link */}
            {/* <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                {...register('link')}
                className="input-field"
                placeholder="https://example.com"
              />
              <p className="mt-1 text-xs text-gray-500">Optional: Where the page/banner should link to</p>
            </div> */}

            {/* Image Upload - Multiple */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Images <span className="text-red-500">*</span>
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(image)}
                          alt={`Page ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {previewImages.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each (Max 10 images)</p>
                </div>
              </div>

              {/* Validation message */}
              {!id && previewImages.length === 0 && existingImages.length === 0 && (
                <p className="mt-1 text-sm text-red-600">Please upload at least one image</p>
              )}
            </div>

            {/* Image Replacement Option (for update only) */}
            {id && (
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      {...register('replaceImages')}
                      value="false"
                      id="appendImages"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="appendImages" className="ml-2 block text-sm text-gray-700">
                      Append new images to existing ones
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      {...register('replaceImages')}
                      value="true"
                      id="replaceImages"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="replaceImages" className="ml-2 block text-sm text-gray-700">
                      Replace all existing images
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Active Status */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  defaultChecked={true}
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Active (page will be displayed on the website)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/banners')}
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
            {id ? 'Update Page/Banner' : 'Create Page/Banner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;