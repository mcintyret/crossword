import * as React from "react";

export interface SquareProps {
    number?: number;
    isEditing?: boolean;
    isSelected?: boolean;
    value: string;

    onClick(): void;

    onChange(newValue: string): void;

    onBack(): void;

    onForward(): void;

    onStopEditing(): void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Square extends React.PureComponent<SquareProps, {}> {
    render() {
        const { value, isEditing, isSelected, number } = this.props;
        const className = "square" + (isSelected ? " -selected" : "") + (isEditing ? " -editing" : "");
        if (!isEditing) {
            return (
                <div
                    className={className}
                    onClick={this.handleClick}
                >
                    {number !== undefined && <span className="number">{number}</span>}
                    {value}
                </div>
            );
        }

        return (
            <input
                autoFocus={true}
                className={className}
                value={value}
                onChange={this.handleChange}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
            />
        );
    }

    private handleClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
        evt.stopPropagation();
        evt.preventDefault();
        this.props.onClick();
    }

    private handleChange = (evt: React.FormEvent<HTMLInputElement>) => {
        const value = evt.currentTarget.value.toUpperCase();
        if (value === "" || (value.length === 1 && ALPHABET.includes(value))) {
            this.props.onChange(value);
            if (value !== "") {
                this.props.onForward();
            }
        }
        evt.stopPropagation();
        evt.preventDefault();
    }

    private handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        let handled = false;
        if (this.props.value === "" && evt.key === "Backspace") {
            this.props.onBack();
            handled = true;
        } else if (evt.key === "ArrowLeft" || evt.key === "ArrowUp") {
            this.props.onBack();
            handled = true;
        } else if (evt.key === "ArrowRight" || evt.key === "ArrowDown") {
            this.props.onForward();
            handled = true;
        } else if (evt.key === "Escape") {
            this.props.onStopEditing();
            handled = true;
        }

        if (handled) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
}

export namespace Square {
    export const Blank = <div className="square -blank"/>
}