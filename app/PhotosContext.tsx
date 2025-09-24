import React, { createContext, useContext, useState } from "react";

export type Photo = { full: string; thumb: string };

type PhotosContextType = {
  photos: Photo[];
  addPhotos: (newPhotos: string[]) => void;
  clearPhotos: () => void;
};

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

export const PhotosProvider = ({ children }: { children: React.ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const addPhotos = (newUris: string[]) => {
    setPhotos((prev) => [
      ...prev,
      ...newUris.map((uri) => ({ full: uri, thumb: uri })), 
    ]);
  };

  const clearPhotos = () => setPhotos([]);

  return (
    <PhotosContext.Provider value={{ photos, addPhotos, clearPhotos }}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (!context) throw new Error("usePhotos must be used inside PhotosProvider");
  return context;
};

export default PhotosProvider;
