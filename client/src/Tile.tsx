import type { TileRecord } from "./types";
import "./Tile.css";
import { useEffect, useRef, useState } from "react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export const Tile = ({
  tile,
  invalid = false,
}: {
  tile: TileRecord;
  invalid?: boolean;
}) => {
  const { location, letter, value, fromRack } = tile;
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      getInitialData: () => ({ location, letter }),
      onDrop: () => setDragging(false),
      canDrag: () => fromRack,
    });
  }, []);

  return (
    <div
      className="tile"
      ref={ref}
      style={
        dragging
          ? { opacity: 0.4 }
          : { border: invalid ? "1px solid red " : "none" }
      }
    >
      <p>{letter}</p>
      <p
        style={{
          fontSize: 12,
          position: "relative",
          top: "-15px",
          right: "-12px",
        }}
      >
        {value}
      </p>
    </div>
  );
};
