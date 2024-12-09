const url = `https://api.cloudinary.com/v1_1/dr0xghsna/auto/upload`;
const uploadFile = async (file, path) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", path);

  const res = await fetch(url, {
    method: "post",
    body: formData,
  });
  const resData = await res.json();

  return resData;
};

export default uploadFile;
