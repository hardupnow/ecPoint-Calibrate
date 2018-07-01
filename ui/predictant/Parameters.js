import React, { Component } from 'react'
import { Set } from 'immutable'

import {
  Grid,
  Card,
  Button,
  Checkbox,
  Icon,
  Table,
  Dropdown,
  Input,
  Label,
  Radio,
  Item,
} from 'semantic-ui-react'

import client from '../utils/rpc'
import { remote } from 'electron'

const mainProcess = remote.require('./server')

class Parameters extends Component {
  accHasError = () =>
    this.props.parameters.acc === '' ||
    /^(6|12|24)$/.test(this.props.parameters.acc)
      ? null
      : true

  getAccField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Enter accumulation (in hours) of the parameter to post-process:
          </h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.accHasError()}
            onChange={e =>
              this.props.onParametersAccFieldChange(e.target.value)
            }
            value={this.props.parameters.acc || ''}
          />
        </Item.Description>
        <Item.Extra>Valid values are: 6, 12, 24</Item.Extra>
      </Item.Content>
    </Item>
  )

  dateStartHasError = () =>
    this.props.parameters.date_start === '' ||
    /^\d{8}$/.test(this.props.parameters.date_start)
      ? null
      : true

  getDateStartField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter start date:</h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.dateStartHasError()}
            onChange={e =>
              this.props.onParametersDateStartFieldChange(e.target.value)
            }
            value={this.props.parameters.date_start || ''}
          />
        </Item.Description>
        <Item.Extra>
          Date must be in <code>YYYYMMDD</code> format.
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  dateEndHasError = () =>
    this.props.parameters.date_end === '' ||
    /^\d{8}$/.test(this.props.parameters.date_end)
      ? null
      : true

  getDateEndField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter end date:</h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.dateEndHasError()}
            onChange={e =>
              this.props.onParametersDateEndFieldChange(e.target.value)
            }
            value={this.props.parameters.date_end || ''}
          />
        </Item.Description>
        <Item.Extra>
          Date must be in <code>YYYYMMDD</code> format.
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  limSUHasError = () =>
    this.props.parameters.limSU === '' ||
    /^\d+$/.test(this.props.parameters.limSU)
      ? null
      : true

  getLimSUField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Enter upper limit (in hours) of the window in the forecast with
            spin-up problems:
          </h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.limSUHasError()}
            onChange={e =>
              this.props.onParametersLimSUFieldChange(e.target.value)
            }
            value={this.props.parameters.limSU || ''}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  rangeHasError = () =>
    this.props.parameters.range === '' ||
    /^\d+$/.test(this.props.parameters.range)
      ? null
      : true

  getRangeField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter a range for the Leadtime (in hours):</h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.rangeHasError()}
            onChange={e =>
              this.props.onParametersRangeFieldChange(e.target.value)
            }
            value={this.props.parameters.range || ''}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  getPathOutField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select output filename and directory for storing results:</h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onOutPathChange(mainProcess.saveFile())}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>{this.props.parameters.outPath}</Item.Extra>
      </Item.Content>
    </Item>
  )

  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-layout-spacer" />
        <div className="mdl-cell mdl-cell--4-col">
          <div className="demo-card-square mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Parameters</h2>
            </div>
            <Item.Group>
              {this.getDateStartField()}
              {this.getDateEndField()}
            </Item.Group>
            {this.getAccField()}
            {this.getLimSUField()}
            {this.getRangeField()}
            {this.getPathOutField()}
          </div>
        </div>
        <div className="mdl-layout-spacer" />
      </div>
    )
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>Parameters</Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>
                {this.getDateStartField()}
                {this.getDateEndField()}
                {this.getAccField()}
                {this.getLimSUField()}
                {this.getRangeField()}
                {this.getPathOutField()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Parameters
