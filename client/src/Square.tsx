import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import "./Square.css";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { canMove, isCoord, isEqualCoord, isTileType } from "./functions";
import type { Coord, TileRecord } from "./types";

type HoveredState = "idle" | "validMove" | "invalidMove";

export const Square = ({
  tiles,
  location,
  children,
}: PropsWithChildren<{ tiles: TileRecord[]; location: Coord }>) => {
  const ref = useRef(null);
  const [state, setState] = useState<HoveredState>("idle");

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      canDrop: ({ source }) => {
        if (!isCoord(source.data.location)) {
          return false;
        }
        return !isEqualCoord(source.data.location, location);
      },
      onDragEnter: ({ source }) => {
        // source is the piece being dragged over the drop target
        if (
          // type guards
          !isCoord(source.data.location) ||
          !isTileType(source.data.letter)
        ) {
          return;
        }

        if (canMove(source.data.location, location, tiles)) {
          setState("validMove");
        } else {
          setState("invalidMove");
        }
      },
      onDragLeave: () => setState("idle"),
      onDrop: () => setState("idle"),
    });
  }, [location, tiles]);

  return (
    <div
      className="square"
      ref={ref}
      style={{ backgroundColor: getColor(state) }}
    >
      {children}
    </div>
  );
};

function getColor(state: HoveredState) {
  switch (state) {
    case "validMove": {
      return "skyblue";
    }
    case "invalidMove": {
      return "red";
    }
    case "idle":
    default: {
      return "transparent";
    }
  }
}
