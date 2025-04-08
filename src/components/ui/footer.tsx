import React from 'react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-4 text-center">
      <div className="container mx-auto">
        <p className="text-sm text-gray-500">
          {year} Antonio Ródenas Jurado
        </p>
      </div>
    </footer>
  );
}
