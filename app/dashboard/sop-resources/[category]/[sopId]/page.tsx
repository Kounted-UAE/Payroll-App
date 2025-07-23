import React from 'react';

export default function SOPDetailPage({ params }: { params: { category: string, sopId: string } }) {
  return <div className="p-8">SOP Detail for category: {params.category}, sopId: {params.sopId} (placeholder)</div>;
} 