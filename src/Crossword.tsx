import * as React from "react";
import { Clue, Crossword } from "./model";
import { Square, SquareProps } from "./Square";

export interface CrosswordPanelProps {
    crossword: Crossword;
}

export interface CellState {
    props: SquareProps;
    point: Point;
    clues: Clue[];
}

export interface Point {
    row: number;
    col: number;
}

export interface CrosswordPanelState {
    grid: CellState[][] | undefined;
    selectedClue: Clue | undefined;
    editingPoint: Point | undefined;
}

function getNextEditingPoint(clue: Clue, row: number, col: number): Point | undefined {
    if (clue.direction === "across") {
        if (col === clue.startX + clue.answer.length) {
            return undefined;
        }
        return { row, col: col + 1 };
    }
    if (clue.direction === "down") {
        if (row === clue.startY + clue.answer.length) {
            return undefined;
        }
        return { row: row + 1, col };
    }
    throw new Error();
}

function getPrevEditingPoint(clue: Clue, row: number, col: number): Point | undefined {
    if (clue.direction === "across") {
        if (col === clue.startX) {
            return undefined;
        }
        return { row, col: col - 1 };
    }
    if (clue.direction === "down") {
        if (row === clue.startY) {
            return undefined;
        }
        return { row: row - 1, col };
    }
    throw new Error();
}

export class CrosswordPanel extends React.PureComponent<CrosswordPanelProps, CrosswordPanelState> {

    state: CrosswordPanelState = {
        grid: undefined,
        selectedClue: undefined,
        editingPoint: undefined
    }

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
        const grid: CellState[][] = [];
        for (let i = 0; i < size; i++) {
            grid.push([]);
        }

        clues.forEach(clue => {
            for (let col = clue.startX, row = clue.startY, i = 0; i < clue.answer.length; i++, clue.direction === "across" ? col++ : row++) {
                const number = col === clue.startX && row === clue.startY ? clue.number : undefined;
                const state = grid[row][col];
                if (state) {
                    state.clues.push(clue);
                } else {
                    grid[row][col] = {
                        props: {
                            value: "",
                            number,
                            onChange: (value: string) => this.handleChangeValue(value, col, row),
                            onStopEditing: this.handleStopEditing,
                            onClick: () => this.handleClick(col, row),
                            onBack: () => this.handleBack(col, row),
                            onForward: () => this.handleForward(col, row)
                        },
                        point: {
                            row,
                            col,
                        },
                        clues: [clue]
                    }
                }
            }
        });
        this.setState({ grid });
    }

    private handleBack = (col: number, row: number) => {
        const { selectedClue } = this.state;
        if (selectedClue === undefined) {
            throw new Error();
        }
        this.setState({
            editingPoint: getPrevEditingPoint(selectedClue, row, col)
        });
    }

    private handleForward = (col: number, row: number) => {
        const { selectedClue } = this.state;
        if (selectedClue === undefined) {
            throw new Error();
        }
        this.setState({
            editingPoint: getNextEditingPoint(selectedClue, row, col)
        });
    }

    private handleStopEditing = () => this.setState({editingPoint: undefined});

    private handleChangeValue = (value: string, col: number, row: number) => {
        const { grid, selectedClue } = this.state;
        if (selectedClue === undefined) {
            throw new Error();
        }

        const newGrid = [...grid];
        const newRow = [...newGrid[row]];
        const props = { ...newRow[col].props, value };
        newRow[col] = { ...newRow[col], props };
        newGrid[row] = newRow;

        this.setState({
            grid: newGrid
        });
    }

    private handleClick = (col: number, row: number) => {
        const cell = this.state.grid[row][col];
        if (cell === undefined) {
            throw new Error();
        }

        const { selectedClue } = this.state;
        let newSelectedClue: Clue;
        if (selectedClue === undefined) {
            newSelectedClue = cell.clues[0];
        } else {
            const index = cell.clues.indexOf(selectedClue);
            if (index < 0) {
                newSelectedClue = cell.clues[0];
            } else {
                const nextIndex = (index + 1) % cell.clues.length;
                newSelectedClue = cell.clues[nextIndex];
            }
        }
        this.setState({
            selectedClue: newSelectedClue,
            editingPoint: cell.point
        });
    }

    render() {
        const { grid } = this.state;
        if (grid === undefined) {
            return "No crossword!";
        }
        const rows: JSX.Element[] = [];
        const { size } = this.props.crossword;
        for (let row = 0; row < size; row++) {
            const cells: JSX.Element[] = [];
            for (let col = 0; col < size; col++) {
                cells.push(this.renderCell(this.state.grid[row][col]));
            }
            rows.push((
                <div className="row">
                    {cells}
                </div>
            ))
        }
        return (
            <div className="crossword" onClick={this.handleStopEditing}>
                {rows}
            </div>
        )
    }

    private renderCell(cell: CellState | undefined) {
        if (cell === undefined) {
            return Square.Blank;
        }

        const { selectedClue, editingPoint } = this.state;

        const isEditing = editingPoint !== undefined
            && editingPoint.col === cell.point.col
            && editingPoint.row === cell.point.row;

        const selected = selectedClue !== undefined &&
            cell.clues.some(clue => clue === selectedClue);

        return (
            <Square
                {...cell.props}
                isEditing={isEditing}
                isSelected={selected}
            />
        );
    }
}