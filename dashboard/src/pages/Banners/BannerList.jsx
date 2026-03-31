import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiImage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSearch
} from 'react-icons/fi';
import { fetchBanners, deleteBanner } from '../../redux/slices/bannerSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const BannerList = () => {
  const dispatch = useDispatch();
  const { banners, loading, totalBanners } = useSelector((state) => state.banners);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBanners, setFilteredBanners] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 10;
  const totalPages = Math.ceil((totalBanners || 0) / limit) || 1;

  console.log("banners", banners);

  useEffect(() => {
    dispatch(fetchBanners({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBanners(
        banners.filter(
          (banner) =>
            banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            banner.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBanners(banners);
    }
  }, [searchTerm, banners]);

  const handleDelete = (id) => {
    dispatch(
      openModal({
        type: 'confirm',
        data: {
          title: 'Delete Banner',
          message: 'Are you sure you want to delete this banner?',
          onConfirm: () => {
            dispatch(deleteBanner(id));
            toast.success('Banner deleted successfully');
          }
        }
      })
    );
  };

  // Get the first image from either images array or single image field
  const getFirstImage = (banner) => {
    if (banner.images && banner.images.length > 0) {
      return getImageUrl(banner.images[0]);
    }
    return '/placeholder-image.jpg';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pages / Banners</h1>
          <p className="text-gray-600 mt-1">Manage all your pages and banners</p>
        </div>
        <Link to="/banners/add" className="btn-primary flex items-center">
          <FiPlus className="mr-2" size={18} />
          Add New Page/Banner
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title or page name..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBanners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner) => (
            <div key={banner._id} className="card group">
              {/* Banner Images - Show first image as preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getFirstImage(banner)}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Image count badge */}
                {banner.images?.length > 1 && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <FiImage className="mr-1" size={12} />
                    {banner.images.length}
                  </div>
                )}

                <div className="absolute top-2 right-2 flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${banner.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{banner.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Page: {banner.name}
                      {banner.pageType && <span className="ml-2 text-xs text-gray-400">({banner.pageType})</span>}
                    </p>
                  </div>
                </div>

                {banner.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{banner.description}</p>
                )}

                {/* Position and Date */}
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <span>Position: {banner.position}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(banner.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link
                      to={`/banners/edit/${banner._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  <Link
                    to={`/banners/page/${banner.name}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    <FiEye className="mr-1" size={16} />
                    View Page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FiImage className="mx-auto text-gray-400" size={64} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No pages/banners found</h3>
          <p className="mt-2 text-gray-600">
            {searchTerm ? 'No items match your search' : 'Get started by creating your first page/banner'}
          </p>
          {!searchTerm && (
            <Link to="/banners/add" className="btn-primary mt-6 inline-flex items-center">
              <FiPlus className="mr-2" size={18} />
              Add Your First Page/Banner
            </Link>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerList;