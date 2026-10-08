import { useCallback, useState } from 'react';
import { UploadCloud, X, CheckCircle } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../services/cloudinary';
import { compressImage } from '../../../lib/imageCompression';

const ProductImageUploader = ({ images = [], onChange, onError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFiles = useCallback(async (files) => {
    if (images.length + files.length > 6) {
      if (onError) onError("You can only upload up to 6 images.");
      return;
    }

    setIsUploading(true);
    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= 6) break;
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          if (onError) onError(`File ${file.name} is not an image.`);
          continue;
        }

        const compressedFile = await compressImage(file, {
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 0.8
        });

        const url = await uploadImageToCloudinary(compressedFile);
        newImages.push(url);
      }
      onChange(newImages);
    } catch (err) {
      console.error(err);
      if (onError) onError("Failed to upload image(s).");
    } finally {
      setIsUploading(false);
    }
  }, [images, onChange, onError]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const moveImage = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      onChange(newImages);
    } else if (direction === 'down' && index < images.length - 1) {
      const newImages = [...images];
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
      onChange(newImages);
    }
  };

  const setAsPrimary = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const primary = newImages.splice(index, 1)[0];
    newImages.unshift(primary);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:bg-gray-50'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          disabled={isUploading || images.length >= 6}
        />
        
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          ) : (
            <UploadCloud size={32} className="text-gray-400" />
          )}
          <div className="text-sm font-medium text-gray-700">
            {isUploading ? "Uploading..." : "Click or drag images to upload"}
          </div>
          <div className="text-xs text-gray-500">
            SVG, PNG, JPG or GIF (max. 6 images)
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((imgUrl, index) => (
            <div key={`${imgUrl}-${index}`} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-100">
              <img src={imgUrl} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded shadow-sm flex items-center gap-1">
                  <CheckCircle size={12} /> Primary
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeImage(index); }}
                    className="p-1 bg-white/90 text-red-600 rounded-full hover:bg-white transition shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-white/90 rounded px-1 py-1 shadow-sm">
                   {index !== 0 && (
                     <button
                       type="button"
                       onClick={(e) => { e.preventDefault(); setAsPrimary(index); }}
                       className="text-xs font-medium text-gray-700 hover:text-black px-1"
                     >
                       Make Primary
                     </button>
                   )}
                   <div className="flex gap-1 ml-auto">
                     <button 
                       type="button" 
                       onClick={(e) => { e.preventDefault(); moveImage(index, 'up'); }}
                       disabled={index === 0}
                       className="text-xs font-bold px-1 disabled:opacity-30"
                     >
                       ←
                     </button>
                     <button 
                       type="button" 
                       onClick={(e) => { e.preventDefault(); moveImage(index, 'down'); }}
                       disabled={index === images.length - 1}
                       className="text-xs font-bold px-1 disabled:opacity-30"
                     >
                       →
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;
