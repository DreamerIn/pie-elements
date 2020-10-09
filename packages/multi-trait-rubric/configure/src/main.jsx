import React from 'react';
import PropTypes from 'prop-types';

import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import EditableHtml from '@pie-lib/editable-html';
import { Authoring } from '@pie-lib/rubric';
import { InputContainer } from '@pie-lib/config-ui';

const styles = theme => ({
  authoring: {
    '& h5': {
      // todo add a prop in Authoring instead!!!
      display: 'none'
    }
  },
  scaleWrapper: {
    border: '1px solid lightgrey',
    padding: '16px',
    margin: '12px 0'
  },
  prompt: {
    paddingTop: theme.spacing.unit * 2,
    width: '100%'
  },
  promptHolder: {
    width: '100%',
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  scaleTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export class Main extends React.Component {
  onScaleChanged = (s, params) => {
    const { model, onModelChanged } = this.props;
    const { scales } = model || {};

    scales[s].maxPoints = params.maxPoints;
    scales[s].scorePointsLabels = params.points;
    scales[s].excludeZero = params.excludeZero;

    onModelChanged({ ...model, scales });
  }

  onScaleRemoved = (index) => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

    scales = [
      ...scales.slice(0, index),
      ...scales.slice(index + 1)
    ];

    onModelChanged({ ...model, scales });
  }

  onScaleAdded = () => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

    scales.push({
      excludeZero: false,
      maxPoints: 1,
      scorePointsLabels: ['', ''],
      traitLabel: '',
      traits: []
    });

    onModelChanged({ ...model, scales });
  }

  onTraitLabelChanged = (index, prompt) => {
    const { model, onModelChanged } = this.props;
    const { scales } = model || {};

    scales[index].traitLabel = prompt;

    onModelChanged({ ...model, scales });
  }

  render() {
    const { model, classes } = this.props || {};
    const { scales } = model || {};

    return (
      <div className={classes.authoring}>
        {scales.map((scale, scaleIndex) => (
          <div key={`scale-${scaleIndex}`} className={classes.scaleWrapper}>
            <div className={classes.scaleTitleWrapper}>
              <h2>Scale - {scaleIndex}</h2>
              <Delete onClick={() => this.onScaleRemoved(scaleIndex)}>Remove Scale</Delete>
            </div>

            <div>
              <InputContainer
                label='Trait label:'
                className={classes.promptHolder}
              >
                <EditableHtml
                  className={classes.prompt}
                  markup={scale.traitLabel || ''}
                  onChange={prompt => this.onTraitLabelChanged(scaleIndex, prompt)}
                  nonEmpty={false}
                  disableUnderline
                />
              </InputContainer>
            </div>

            <Authoring
              value={{
                points: scale.scorePointsLabels,
                maxPoints: scale.maxPoints,
                excludeZero: scale.excludeZero
              }}
              onChange={(params) => this.onScaleChanged(scaleIndex, params)}
            />
          </div>
        ))}

        <Button
          className={classes.addButton}
          variant="contained"
          color="primary"
          onClick={this.onScaleAdded}
        >
          Add Scale
        </Button>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object,
  model: PropTypes.object,
  onModelChanged: PropTypes.func,
}

const Styled = withStyles(styles)(Main);

export default Styled;
