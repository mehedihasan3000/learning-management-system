'use client';

import React from 'react';
import { Video } from '@gravity-ui/icons';

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export function formatEmbedUrl(url: string): string {
  if (!url) return '';

  const cleanUrl = url.trim();

  // If already an embed URL
  if (cleanUrl.includes('youtube.com/embed/')) {
    return cleanUrl;
  }

  // Handle youtube.com/watch?v=ID
  const youtubeWatchMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (youtubeWatchMatch && youtubeWatchMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeWatchMatch[1]}?autoplay=0&rel=0`;
  }

  // Handle Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
  }

  return cleanUrl;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const embedUrl = formatEmbedUrl(url);

  if (!url) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-6 border border-slate-800">
        <Video className="h-12 w-12 text-slate-600 mb-3" />
        <p className="text-base font-medium text-slate-300">No lecture video selected</p>
        <p className="text-xs text-slate-500 mt-1">Select a lecture from the curriculum to begin</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-slate-900/10">
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          title={title || 'Lecture Video'}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

