import React from "react";

interface VideoPlayerProps {
  src: string;
  width?: string;
  height?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  width = "100%",
  height = "auto",
  controls = true,
  autoPlay = true,
  loop = true,
  muted = true,
}) => {
  return (
    <video
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
    >
      <source src={src} type="video/mp4" />
      <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      <source src={src.replace(".mp4", ".ogg")} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
