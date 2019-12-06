import * as React from "react";
import { LinePath } from "@vx/shape";
import { Drag } from "@vx/drag";
import { curveBasis } from "@vx/curve";
import "./index.css";
export default class DragII extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || []
    };
  }

  componentDidUpdate() {
    var svg = document.getElementById("svg");

    this.props.clearAllFn(this.state.data, svg);

  }

  componentWillReceiveProps(props) {
    this.setState({ data: props.data });
  }

  render() {
    const { width, height } = this.props;
    return (
      <div className="DragII tchActNone">
        <svg id="svg" width={width} height={height}>
          <rect id="rect" fill="white" width={width} height={height} rx={5} />
          {this.state.data.map((d, i) => {
            return (
              <LinePath
                key={`line-${i}`}
                fill={"transparent"}
                stroke="gray"
                strokeWidth={3}
                data={d}
                curve={curveBasis}
                x={d => d.x}
                y={d => d.y}
              />
            );
          })}
          <Drag
            width={width}
            height={height}
            resetOnStart={true}
            onDragStart={({ x, y }) => {
              this.setState((state, props) => {
                const newLine = [{ x, y }];
                return {
                  data: state.data.concat([newLine])
                };
              });
            }}
            onDragMove={({ x, y, dx, dy }) => {
              this.setState((state, props) => {
                const nextData = [...state.data];
                const point = [{ x: x + dx, y: y + dy }];
                const i = nextData.length - 1;
                nextData[i] = nextData[i].concat(point);
                return { data: nextData };
              });
            }}
          >
            {({ x, y, dx, dy, isDragging, dragStart, dragEnd, dragMove }) => {
              return (
                <g>
                  {isDragging && (
                    <g>
                      <rect
                        fill="white"
                        width={8}
                        height={8}
                        x={x + dx - 4}
                        y={y + dy - 4}
                        className="pntEventNe"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={4}
                        fill="transparent"
                        stroke="white"
                        className="pntEventNe"
                      />
                    </g>
                  )}
                  <rect
                    fill="transparent"
                    width={width}
                    height={height}
                    onMouseDown={dragStart}
                    onMouseUp={dragEnd}
                    onMouseMove={dragMove}
                    onTouchStart={dragStart}
                    onTouchEnd={dragEnd}
                    onTouchMove={dragMove}
                  />
                </g>
              );
            }}
          </Drag>
        </svg>
      </div>
    );
  }
}
