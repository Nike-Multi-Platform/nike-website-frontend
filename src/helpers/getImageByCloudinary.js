export const getImageByCloudinary = (publicId, width = 350, height = 400) => {
  return `https://res.cloudinary.com/dr0xghsna/image/upload/w_${width},h_${height}/${publicId}`;
};
