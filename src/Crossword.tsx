import * as React from "react";
import {Crossword} from "./model";
import {Square, SquareProps} from "./Square";

export interface CrosswordPanelProps {
    crossword: Crossword;
}

export interface CrosswordPanelState {
    grid: SquareProps[][];
}

export class CrosswordPanel extends React.PureComponent<CrosswordPanelProps, CrosswordPanelState> {

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps: CrosswordPanelProps) {
        if (prevProps.crossword !== this.props.crossword) {
            this.init();
        }
    }

    private init() {
        const { size, clues } = this.props.crossword;
        const grid: SquareProps[][] = [];
        for (let i = 0; i < size; i++) {
            grid.push([]);
        }

        clues.forEach(clue => {
            for (let x = clue.startX, y = clue.startY, i = 0; i < clue.answer.length; i++, clue.direction === "across" ? x++ : y++) {
                grid[x][y] = {
                    value: "",
                    onChange: (value: string) => this.handleChangeValue(value, x, y)
                }
            }
        });
        this.setState({grid});
    }

    private handleChangeValue = (value: string, x: number, y: number) => {
        const newGrid = [...this.state.grid];
        const newRow = [...newGrid[x]];
        newRow[y] = {...newRow[y], value};
        newGrid[x] = newRow;
        this.setState({grid: newGrid});
    }

    render() {
        return (
            <div className="crossword">
                {this.state.grid.map(row => (
                    <div className="row">
                        {row.map(this.renderCell)}
                    </div>
                ))}
            </div>
        )
    }

    private renderCell = (cell: SquareProps | undefined) => {
        if (cell === undefined) {
            return Square.Blank;
        }

        return <Square {...cell}/>;
    }
}