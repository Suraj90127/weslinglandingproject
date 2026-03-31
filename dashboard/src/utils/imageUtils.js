// Get base URL
export const getBaseUrl = () => {
  const isProduction = window.location.hostname === "aweprowrestling.com";
  const defaultProdUrl = 'https://aweprowrestling.com';
  return import.meta.env.VITE_API_URL?.replace('/api', '') || (isProduction ? defaultProdUrl : 'http://localhost:5110');
};

// Complete image URL banao
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';

  // 1. Agar already full URL, data URL, ya blob URL hai to wahi return karo
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // 2. Path normalization (slashes normalize karo aur absolute check karo)
  let path = imagePath.replace(/\\/g, '/');
  if (path.startsWith('/')) path = path.substring(1);

  // 3. Agar local path hai aur "uploads/" se start nahi hota, to add karo
  // (Assuming backend par static folder /uploads hai)
  if (!path.startsWith('uploads/')) {
    path = `uploads/${path}`;
  }

  // 4. Base URL ke saath jodo
  const baseUrl = getBaseUrl().replace(/\/$/, '');

  return `${baseUrl}/${path}`;
};

// Banner se images array nikaalo
export const getBannerImages = (banner) => {
  if (!banner) return [];

  // Pehle images array check karo
  if (banner.images && banner.images.length > 0) {
    return banner.images;
  }

  // Agar images array nahi hai to image field check karo
  if (banner.image) {
    return [banner.image];
  }

  // allImages field check karo (model se virtual field)
  if (banner.allImages && banner.allImages.length > 0) {
    return banner.allImages;
  }

  return [];
};