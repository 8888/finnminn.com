import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: 'raw' | 'artifact';
  size?: 'thumbnail' | 'full';
  caption?: string;
  disableGlitch?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  variant = 'raw',
  size = 'full',
  caption,
  disableGlitch = false,
  className = '',
  ...props
}) => {
  const containerClasses = [
    'relative inline-block group border-2 border-void shadow-pixel transition-shadow duration-200',
    // Artifact variant styles
    variant === 'artifact' ? 'bg-surface pb-8 pr-2 pl-2 pt-2' : '',
    // Size styles
    size === 'thumbnail' ? 'w-24 h-24' : 'w-full max-w-full',
    // Hover interaction (No movement, just shadow glow)
    'hover:shadow-pixel-witchcraft',
    className
  ].join(' ');

  const imgWrapperClasses = [
    'relative overflow-hidden w-full h-full',
  ].join(' ');

  const imgClasses = [
    'block w-full h-full object-cover relative z-10',
  ].join(' ');

  return (
    <figure className={containerClasses}>
      <div className={imgWrapperClasses}>
        {/* Main Image */}
        <img src={src} alt={alt} className={imgClasses} {...props} />

        {/* Glitch Ghost Layers - Visible on Hover */}
        {!disableGlitch && (
          <>
            <img 
              src={src} 
              alt="" 
              className="absolute top-0 left-0 w-full h-full object-cover z-20 opacity-0 group-hover:opacity-60 mix-blend-hard-light group-hover:animate-glitch-1 pointer-events-none" 
              aria-hidden="true" 
            />
            <img 
              src={src} 
              alt="" 
              className="absolute top-0 left-0 w-full h-full object-cover z-20 opacity-0 group-hover:opacity-60 mix-blend-hard-light group-hover:animate-glitch-2 pointer-events-none" 
              aria-hidden="true" 
            />
          </>
        )}
      </div>

      {variant === 'artifact' && caption && (
        <figcaption className="absolute bottom-0 left-0 w-full text-center py-2 font-body text-xs text-text-muted uppercase tracking-wider overflow-hidden text-ellipsis whitespace-nowrap px-1">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
