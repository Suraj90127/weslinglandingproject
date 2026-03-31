import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchBannerByPage } from '../../redux/slices/bannerSlice';
import { getImageUrl } from '../../utils/imageUtils';

const BannerPage = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { pageBanners, loading } = useSelector((state) => state.banners);
  const [activeImageIndex, setActiveImageIndex] = useState({});

  useEffect(() => {
    if (name) {
      dispatch(fetchBannerByPage(name));
    }
  }, [dispatch, name]);

  const nextImage = (bannerId, totalImages) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [bannerId]: ((prev[bannerId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (bannerId, totalImages) => {
    setActiveImageIndex(prev => ({
      ...prev,
      [bannerId]: ((prev[bannerId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  console.log("pageBanners", pageBanners);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Link
          to="/banners"
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {name} Page
          </h1>
          <p className="text-gray-600 mt-1">
            Viewing all content for the {name} page
          </p>
        </div>
      </div>

      {/* Banners Display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pageBanners && pageBanners.length > 0 ? (
        <div className="space-y-8">
          {pageBanners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Banner Image Carousel */}
              {banner.images && banner.images.length > 0 && (
                <div className="relative">
                  {/* Main Image */}
                  <img
                    src={getImageUrl(banner.images[activeImageIndex[banner._id] || 0])}
                    alt={`${banner.title} - Image ${(activeImageIndex[banner._id] || 0) + 1}`}
                    className="w-full h-auto max-h-96 object-cover"
                  />

                  {/* Image Navigation */}
                  {banner.images.length > 1 && (
                    <>
                      {/* Navigation Arrows */}
                      <button
                        onClick={() => prevImage(banner._id, banner.images.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => nextImage(banner._id, banner.images.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <FiChevronRight size={24} />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {banner.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImageIndex(prev => ({ ...prev, [banner._id]: index }))}
                            className={`w-2 h-2 rounded-full transition-all ${(activeImageIndex[banner._id] || 0) === index
                              ? 'bg-white w-4'
                              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Link Button */}
                  {banner.link && (
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Visit Link
                    </a>
                  )}
                </div>
              )}

              {/* Banner Info */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{banner.title}</h2>
                    {banner.description && (
                      <p className="text-gray-600 mt-2">{banner.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <span className="ml-2 font-medium text-gray-800">{banner.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Images:</span>
                    <span className="ml-2 font-medium text-gray-800">{banner.images?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium text-gray-800 capitalize">{banner.pageType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium text-gray-800">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-3">
                  <Link
                    to={`/banners/edit/${banner._id}`}
                    className="btn-primary"
                  >
                    Edit Page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FiImage className="mx-auto text-gray-400" size={64} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Content Found</h3>
          <p className="mt-2 text-gray-600">
            There is no active content for the {name} page.
          </p>
          <Link
            to="/banners/add"
            className="btn-primary mt-6 inline-flex items-center"
          >
            Add Content for {name} Page
          </Link>
        </div>
      )}
    </div>
  );
};

export default BannerPage;