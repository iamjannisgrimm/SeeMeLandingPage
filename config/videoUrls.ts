// Vercel Blob CDN base URL
export const BLOB_CDN_BASE = 'https://egpa9h7lsejcuxfd.public.blob.vercel-storage.com';

export const videoUrls = {
  video1: `${BLOB_CDN_BASE}/videos/video1.webm`,
  video2: `${BLOB_CDN_BASE}/videos/video2.webm`,
  video3: `${BLOB_CDN_BASE}/videos/video3.webm`,
  video4: `${BLOB_CDN_BASE}/videos/video4.webm`,
  video5: `${BLOB_CDN_BASE}/videos/video5.webm`,
  video6: `${BLOB_CDN_BASE}/videos/video6.webm`,
};

// Optional: Add poster images for instant visual feedback
// Generate these by extracting first frame from each video:
// ffmpeg -i video1.webm -vframes 1 -q:v 2 poster1.webp
export const posterUrls = {
  video1: `${BLOB_CDN_BASE}/posters/poster1.webp`,
  video2: `${BLOB_CDN_BASE}/posters/poster2.webp`,
  video3: `${BLOB_CDN_BASE}/posters/poster3.webp`,
  video4: `${BLOB_CDN_BASE}/posters/poster4.webp`,
  video5: `${BLOB_CDN_BASE}/posters/poster5.webp`,
  video6: `${BLOB_CDN_BASE}/posters/poster6.webp`,
};
