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

  // Handle standard YouTube URLs: watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = cleanUrl.match(youtubeRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0&modestbranding=1`;
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
      <div className="w-full aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 p-6 border border-slate-800 shadow-lg">
        <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3 border border-slate-700">
          <Video className="h-7 w-7" />
        </div>
        <p className="text-base font-semibold text-slate-200">No lecture video selected</p>
        <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">
          Select any lecture from the curriculum playlist to start streaming.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-slate-900/10">
      <div className="relative w-full aspect-video">
        <iframe
          src={embedUrl}
          title={title || 'Lecture Video Player'}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
