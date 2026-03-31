import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiFileText, FiPlus, FiEdit2, FiTrash2,
  FiSave, FiX, FiCheck, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import {
  fetchAllContent, createContent, updateContent,
  deleteContent
} from '../../redux/slices/contentSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ContentManager = () => {
  const dispatch = useDispatch();
  const { contents, loading } = useSelector((state) => state.contents);
  const [editingContent, setEditingContent] = useState(null); // the content being edited
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchAllContent());
  }, [dispatch]);

  // When editing, fill form with the content's data.
  const handleEdit = (content) => {
    setShowCreateForm(false);
    setEditingContent(content);
    setValue('type', content.type);
    setValue('title', content.title);
    setValue('content', content.content);
    setValue('description', content.description || '');
    setValue('isActive', content.isActive);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setShowCreateForm(true);
    reset({ type: '', title: '', content: '', description: '', isActive: true });
  };

  const handleCancel = () => {
    setEditingContent(null);
    setShowCreateForm(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingContent) {
        await dispatch(updateContent({ id: editingContent._id, payload: data })).unwrap();
        toast.success('Content updated!');
      } else {
        await dispatch(createContent(data)).unwrap();
        toast.success('Content created!');
      }
      dispatch(fetchAllContent());
      handleCancel();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Operation failed');
    }
  };

  const handleDelete = (id, type) => {
    dispatch(openModal({
      type: 'confirm',
      data: {
        title: 'Delete Content',
        message: `Delete "${type}" content permanently?`,
        onConfirm: async () => {
          try {
            await dispatch(deleteContent(id)).unwrap();
            toast.success('Deleted successfully');
            if (editingContent?._id === id) handleCancel();
          } catch { toast.error('Failed to delete'); }
        }
      }
    }));
  };

  const isFormOpen = showCreateForm || editingContent;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage page content for your website</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Add New Content
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingContent ? `Editing: "${editingContent.type}"` : 'Create New Content'}
            </h2>
            <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-400">(slug, e.g. about-us)</span>
                </label>
                <input
                  type="text"
                  {...register('type', {
                    required: editingContent ? false : 'Content type is required',
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message: 'Lowercase letters, numbers, hyphens only'
                    }
                  })}
                  className="input-field"
                  placeholder="about-us"
                  readOnly={!!editingContent}
                />
                {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="input-field"
                  placeholder="About Us"
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                {...register('description')}
                className="input-field"
                placeholder="Short description (optional)"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows="8"
                className="input-field font-mono text-sm"
                placeholder="Write your content here... HTML is supported."
              />
              {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
            </div>

            {/* Status toggle */}
            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active (visible on the website)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2 border-t">
              <button type="button" onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                <FiX size={16} /> Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <FiSave size={16} />}
                {editingContent ? 'Save Changes' : 'Create Content'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Content List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            Existing Content <span className="text-sm font-normal text-gray-400 ml-2">({contents?.length || 0} items)</span>
          </h2>
        </div>

        {loading && !contents?.length ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !contents?.length ? (
          <div className="text-center py-16 text-gray-400">
            <FiFileText className="mx-auto mb-3" size={40} />
            <p className="font-medium">No content yet</p>
            <p className="text-sm mt-1">Click "Add New Content" to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {contents.map((content) => (
              <li key={content._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                      {content.type}
                    </span>
                    <span className={`text-xs font-semibold ${content.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {content.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-800">{content.title}</p>
                  {content.description && (
                    <p className="mt-0.5 text-xs text-gray-400 truncate max-w-md">{content.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(content._id, content.type)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContentManager;