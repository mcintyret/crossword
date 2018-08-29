import * as React from "react";

export interface SquareProps {
    value: string;
    isEditing?: boolean;
    isSelected?: boolean;
    onClick(): void;
    onChange(newValue: string): void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQURTUVWXYZ";

export class Square extends React.PureComponent<SquareProps, {}> {
    render() {
       const { value, isEditing, isSelected, onClick } = this.props;
       const className = "square" + (isSelected ? " -selected" : "");
       if (!isEditing) {
           return <span className={className} onClick={onClick}>{value}</span>
       }

       return (
           <input
               autoFocus={true}
               className={className}
               value={value}
               onChange={this.handleChange}
           />
       )
    }

    private handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
        const value = evt.currentTarget.value.toUpperCase();
        if (value === "" || (value.length === 1 && ALPHABET.includes(value))) {
            this.props.onChange(value);
        }
    }
}

export namespace Square {
    export const Blank = <span className="square -blank"/>
}