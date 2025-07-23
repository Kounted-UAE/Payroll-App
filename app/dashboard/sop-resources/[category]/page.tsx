import React from 'react';

export default function SOPCategoryPage({ params }: { params: { category: string } }) {
  return <div className="p-8">SOP Category: {params.category} (placeholder)</div>;
} 