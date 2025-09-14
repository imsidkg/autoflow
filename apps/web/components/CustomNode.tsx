import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "./ui/button";

type Props = {
  id: string;
  data: {
    label: string;
    onAddNode: (id: string) => void;
  };
};

const CustomNode = (props: Props) => {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="text-center font-semibold">{props.data.label}</div>
      <div className="mt-4">
        <Button
          onClick={() => props.data.onAddNode(props.id)}
          className="w-full"
          variant="outline"
        >
          +
        </Button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400"
      />
    </div>
  );
};

export default React.memo(CustomNode);