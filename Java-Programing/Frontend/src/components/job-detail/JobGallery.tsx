import React from "react";

interface JobGalleryProps {
  images: string[];
}

export default function JobGallery({ images }: JobGalleryProps) {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Văn phòng & Đội ngũ</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {images.map((img, i) => (
          <div key={i} className="flex-shrink-0 w-64 h-40 rounded-3xl overflow-hidden shadow-sm relative group cursor-pointer">
            <img 
              src={img} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              alt={`Office ${i}`} 
            />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white text-2xl font-black">+{images.length - 4}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
