import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const MindMapEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-2 stroke-primary"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default memo(MindMapEdge); 