import type { TileRecord } from "./types"
import "./tile.css"
import { useEffect, useRef, useState } from "react";
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from "tiny-invariant";

export const Tile = ({tile}: {tile: TileRecord}) => {
    const {location, letter} = tile
  const ref = useRef(null);
    const [dragging, setDragging] = useState<boolean>(false); 

    useEffect(() => {
        const el = ref.current;
        invariant(el);

        return draggable({
            element: el,
            onDragStart: () => setDragging(true), 
            getInitialData: () => ({ location , letter}), 
            onDrop: () => setDragging(false), 
        });
    }, []);
    
    return ( 
         <div className="tile" ref={ref} style={dragging ? { opacity: 0.4 } : {}} >
        <p>{letter}</p>
    </div>)
}

