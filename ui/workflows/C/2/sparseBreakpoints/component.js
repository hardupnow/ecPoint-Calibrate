import React, { Component } from 'react'

import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'

import { Button, Item, Label } from 'semantic-ui-react'
import _ from 'lodash'

import client from '~/utils/client'

class SparseBreakpoints extends Component {
  componentDidMount() {
    this.props.breakpoints.length === 0 && this.postThrGridIn()
  }

  getBlankRow = index =>
    [{ readOnly: true, value: index }].concat(
      _.flatMap(this.props.fields, _ => [{ value: '' }, { value: '' }])
    )

  appendBlankRow = () => {
    const newGrid = this.props.sparseBreakpoints.concat([
      this.getBlankRow(this.props.sparseBreakpoints.length),
    ])

    this.props.setSparseBreakpoints(newGrid)
  }

  hasError = () => {
    return !_.every(
      this.props.sparseBreakpoints.slice(1),
      row =>
        _.every(
          row.slice(1),
          cell =>
            ['', 'inf', '-inf'].includes(cell.value) ||
            /^(\d+\.?\d*|\.\d+)$/.test(cell.value)
        ) && !_.every(row.slice(1), cell => cell.value === '')
    )
  }

  postThrGridIn = () => {
    this.setState({ loading: 'Generating weather types.' })

    const labels = this.props.labels
    const records = this.props.sparseBreakpoints
      .slice(1)
      .map(row => _.flatMap(row.slice(1), cell => cell.value))

    client.post(
      {
        url: '/postprocessing/create-wt-matrix',
        body: { labels, records },
        json: true,
      },
      (err, httpResponse, { matrix }) => {
        this.props.setBreakpoints(labels, matrix)
        this.setState({ loading: false })
      }
    )
  }

  render = () => {
    return (
      <Item>
        <Item.Content>
          <Item.Header>
            <h5>Input the threshold breakpoints in the following spreadsheet:</h5>
          </Item.Header>
          <Item.Description>
            <ReactDataSheet
              data={this.props.sparseBreakpoints}
              valueRenderer={cell => cell.value}
              onContextMenu={(e, cell, i, j) =>
                cell.readOnly ? e.preventDefault() : null
              }
              onCellsChanged={changes => {
                const grid = this.props.sparseBreakpoints.map(row => [...row])
                changes.forEach(({ cell, row, col, value }) => {
                  grid[row][col] = { ...grid[row][col], value }
                })
                this.props.setSparseBreakpoints(grid)
              }}
              rowRenderer={props => (
                <tr>
                  {props.children}
                  {props.row > 0 && (
                    <Button
                      icon="delete"
                      circular
                      onClick={() => {
                        const grid = this.props.sparseBreakpoints.map(row => [...row])
                        grid.splice(props.row, 1)
                        this.props.setSparseBreakpoints(grid)
                      }}
                      size="mini"
                      disabled={props.row === 1 ? true : null}
                    />
                  )}
                </tr>
              )}
            />
          </Item.Description>
          <Item.Extra>
            <Button
              content="Generate WTs"
              floated="right"
              size="mini"
              onClick={() => this.postThrGridIn()}
              disabled={this.hasError()}
              primary
            />
            <Button
              content="Add row"
              floated="right"
              primary
              size="mini"
              onClick={() => this.appendBlankRow()}
            />
            <br />
            Valid values are <Label>-inf</Label>, <Label>inf</Label>, and all integers.
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }
}

export default SparseBreakpoints
