'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface GalleryProps {
  images: GalleryImage[]
}

const Gallery = ({ images }: GalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-label={selectedImage.caption || selectedImage.alt}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/90"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-black/70 text-white transition-colors hover:text-brand-teal"
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div className="relative z-10 max-h-[90vh] w-full max-w-6xl">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1600}
              height={1200}
              sizes="90vw"
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-lg font-medium text-center">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        </dialog>
      )}
    </>
  )
}

export default Gallery
