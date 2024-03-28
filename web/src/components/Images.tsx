import React, { SetStateAction, useState } from 'react';
import { BsCloudUpload } from 'react-icons/bs';

interface ImagesProps {
  files: Array<File>
  setFiles: React.Dispatch<SetStateAction<Array<File>>>
}

const Images = ({ files, setFiles }: ImagesProps) => {

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    setFiles(Array.from(droppedFiles));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ?? [];
    setFiles(Array.from(selectedFiles));
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <BsCloudUpload className="text-4xl text-gray-400 mb-3" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default Images;