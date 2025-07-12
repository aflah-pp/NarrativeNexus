import React from 'react';
import { Type } from 'lucide-react';

const ReadingSettings = ({ fontSize, setFontSize, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Font Size:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
                >
                  A-
                </button>
                <span className="text-sm w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingSettings;
