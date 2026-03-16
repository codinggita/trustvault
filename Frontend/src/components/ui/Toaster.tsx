import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster 
      position={{ 
        topRight: { 
          top: '4rem', 
          right: '2rem' 
        } 
      }} 
    />
  );
};