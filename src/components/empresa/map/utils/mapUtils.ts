// Utility functions for maps

// This file is kept for backwards compatibility but most functions
// are no longer needed with OpenStreetMap integration
export const calculateCenter = (coordinates: [number, number][]) => {
  if (coordinates.length === 0) return [-15.7801, -47.9292]; // Default to Brazil center
  
  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  );
  
  return [sum[0] / coordinates.length, sum[1] / coordinates.length] as [number, number];
};

// Other map utility functions can be added here as needed
