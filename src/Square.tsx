import * as React from "react";

export interface SquareProps {
    value: string;
    isEditing?: boolean;
    isSelected?: boolean;
    onChange(newValue: string): void;
}

export class Square extends React.PureComponent<SquareProps, {}> {
    render() {
       const { value, isEditing, isSelected } = this.props;
       const className = "square" + (isSelected ? " -selected" : "");
       if (!isEditing) {
           return <span className={className}>{value}</span>
       }
       throw new Error("Can't handle editing yet!");
    }
}

export namespace Square {
    export const Blank = <span className="square -blank"/>
}