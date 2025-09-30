
import React from 'react';

const EthereumIcon = ({ className = "", size = 24 }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 512 512" 
    className={className}
    fill="currentColor"
  >
    <path d="M256,0C114.615,0,0,114.615,0,256S114.615,512,256,512,512,397.385,512,256,397.385,0,256,0ZM250.818,116.329V207.3l-88.889-41.351Zm0,138.691V373.932L111.652,252.981Zm10.364,118.912V255.02l88.889-51.923Zm0-138.691V116.329l88.889,49.623Z"/>
  </svg>
);

export default EthereumIcon;
