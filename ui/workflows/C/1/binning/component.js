import React, { Component } from 'react'
import { remote } from 'electron'

import {
  Grid,
  Input,
  Card,
  Button,
  Radio,
  Item,
  Icon,
  Label,
  Popup,
  TextArea,
  Form,
  Message,
} from 'semantic-ui-react'

import _ from 'lodash'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Binning extends Component {
  getTextArea = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter binning thresholds for {this.props.error} separated by commas:</h5>
        </Item.Header>

        <Item.Description>
          <Form>
            <TextArea
              rows={1}
              value={this.props.bins}
              onChange={e => this.props.setBins(e.target.value)}
            />
          </Form>

          {this.hasError() ? (
            <Message negative>
              <p>
                Invalid bin value(s) found. Bins must be real numbers, entered in
                ascending order.
              </p>
            </Message>
          ) : (
            <br />
          )}

          {_.filter(
            this.props.bins.map((bin, idx) => bin && <Label key={idx}>{bin}</Label>)
          )}
        </Item.Description>
        <Item.Extra>
          <p>
            <b>Minimum {this.props.error} value:</b> <code>{this.props.minValue}</code>
          </p>
          <p>
            <b>Maximum {this.props.error} value:</b> <code>{this.props.maxValue}</code>
          </p>
          <p>
            <b>Total number of {this.props.error} values:</b>{' '}
            <code>{this.props.count}</code>
          </p>
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  arrayIsSorted = arr => arr.every((v, i, a) => !i || a[i - 1] < v)

  hasError = () =>
    !(
      this.props.bins.length > 0 &&
      _.every(this.props.bins, bin => /^(-?\d+\.?\d*|\.\d+)$/.test(bin)) &&
      this.arrayIsSorted(this.props.bins.map(bin => parseFloat(bin)))
    )

  isComplete = () => !this.hasError() && this.props.fields.length !== 0

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render = () =>
    this.props.fields.length > 0 && (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Binning for {this.props.error}</Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>{this.getTextArea()}</Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
}

export default Binning
