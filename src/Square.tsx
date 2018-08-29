import * as React from "react";

export interface SquareProps {
    value: string;
    isEditing?: boolean;
    isSelected?: boolean;
    onClick(): void;
    onChange(newValue: string): void;
    onBack(): void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Square extends React.PureComponent<SquareProps, {}> {
    render() {
       const { value, isEditing, isSelected, onClick } = this.props;
       const className = "square" + (isSelected ? " -selected" : "") + (isEditing ? " -editing" : "");
       if (!isEditing) {
           return <span className={className} onClick={onClick}>{value}</span>
       }

       return (
           <input
               autoFocus={true}
               className={className}
               value={value}
               onChange={this.handleChange}
               onKeyDown={this.handleKeyDown}
           />
       )
    }

    private handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
        const value = evt.currentTarget.value.toUpperCase();
        if (value === "" || (value.length === 1 && ALPHABET.includes(value))) {
            this.props.onChange(value);
        }
        evt.stopPropagation();
        evt.preventDefault();
    }

    private handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (this.props.value === "" && evt.key === "Backspace") {
            this.props.onBack();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
}

export namespace Square {
    export const Blank = <span className="square -blank"/>
}