export const compressImage = (file, { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = {}) => {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas back to Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error('Canvas to Blob failed'));
          }
          // Create a new File from the blob
          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(newFile);
        }, file.type, quality);
      };
      
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
