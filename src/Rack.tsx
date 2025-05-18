import type { PropsWithChildren } from "react"
import "./Rack.css"

export const Rack = ({children}: PropsWithChildren) => {
    return (
        <div className="rack">
            {children}
        </div>
    )
}