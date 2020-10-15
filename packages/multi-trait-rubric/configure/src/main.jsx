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
  authoringRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  authoringColumn: {
    flex: 1
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
  },
  scaleTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  trait: {
    background: '#e3e3e3',
    margin: '16px 0',
    padding: '16px'
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

  onTraitPropertyChanged = ({ scaleIndex, traitIndex, newValue, property }) => {
    try {
      const { model, onModelChanged } = this.props;
      let { scales } = model || {};
      const scale = scales[scaleIndex];

      scale.traits[traitIndex][property] = newValue;

      scales = [
        ...scales.slice(0, scaleIndex),
        scale,
        ...scales.slice(scaleIndex + 1)
      ];

      onModelChanged({ ...model, scales });
    } catch (e) {
      console.log(e);
    }
  }

  onScorePointDescriptorChanged = (scaleIndex, traitIndex, scorePointIndex, prompt) => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};
    const scale = scales[scaleIndex];

    scale.traits[traitIndex].scorePointsDescriptors[scorePointIndex] = prompt;

    scales = [
      ...scales.slice(0, scaleIndex),
      scale,
      ...scales.slice(scaleIndex + 1)
    ];

    onModelChanged({ ...model, scales });
  }

  onTraitAdded = (scaleIndex) => {
    const { model, onModelChanged } = this.props;
    let { scales } = model || {};

    const scale = scales[scaleIndex];
    const newTrait = {
      label: '',
      standards: [],
      description: '',
      scorePointsDescriptors: [],
    };

    if (!scale.traits) {
      scale.traits = [newTrait]
    } else {
      scale.traits.push(newTrait);
    }

    scales = [
      ...scales.slice(0, scaleIndex),
      scale,
      ...scales.slice(scaleIndex + 1)
    ];

    onModelChanged({ ...model, scales });
  }


  render() {
    const { model, classes } = this.props || {};
    const { scales } = model || {};

    return (
      <div className={classes.authoring}>
        {scales.map((scale, scaleIndex) => {
          const { maxPoints, traitLabel, traits, excludeZero } = scale || {};
          let scorePointsValues = [];

          try {
            for (let pointValue = maxPoints; pointValue >= excludeZero ? 1 : 0; pointValue--) {
              scorePointsValues.push(pointValue);
            }
          } catch (e) {
            console.log(e);
          }

          return (
            <div key={`scale-${scaleIndex}`} className={classes.scaleWrapper}>
              <div className={classes.scaleTitleWrapper}>
                <h2>Scale - {scaleIndex}</h2>
                <Delete onClick={() => this.onScaleRemoved(scaleIndex)}>Remove Scale</Delete>
              </div>

              <div className={classes.authoringRow}>
                <div className={classes.authoringColumn}>
                  <div>
                    <InputContainer
                      label='Trait identifier label:'
                      className={classes.promptHolder}
                    >
                      <EditableHtml
                        className={classes.prompt}
                        markup={traitLabel || ''}
                        onChange={prompt => this.onTraitLabelChanged(scaleIndex, prompt)}
                        nonEmpty={false}
                        disableUnderline
                      />
                    </InputContainer>
                  </div>

                  <h3>Traits:</h3>
                  {
                    traits.map((trait, traitIndex) => {
                      const { label, standards, scorePointsDescriptors, weighting, description } = trait || {};

                      return (
                        <div key={`scale-${scaleIndex}-trait-${traitIndex}`} className={classes.trait}>
                          <InputContainer
                            label='Trait Name:'
                            className={classes.promptHolder}
                          >
                            <EditableHtml
                              className={classes.prompt}
                              markup={label || ''}
                              onChange={prompt => this.onTraitPropertyChanged({
                                scaleIndex,
                                traitIndex,
                                newValue: prompt,
                                property: 'label'
                              })}
                              disableUnderline
                            />
                          </InputContainer>

                          <InputContainer
                            label='Trait Standards:'
                            className={classes.promptHolder}
                          >
                            <EditableHtml
                              className={classes.prompt}
                              markup={standards.join(',') || ''}
                              onChange={prompt => this.onTraitPropertyChanged({
                                scaleIndex,
                                traitIndex,
                                newValue: prompt.split(','),
                                property: 'standards'
                              })}

                              disableUnderline
                            />
                          </InputContainer>

                          <InputContainer
                            label='Trait Description:'
                            className={classes.promptHolder}
                          >
                            <EditableHtml
                              className={classes.prompt}
                              markup={description || ''}
                              onChange={prompt => this.onTraitPropertyChanged({
                                scaleIndex,
                                traitIndex,
                                newValue: prompt,
                                property: 'description'
                              })}

                              disableUnderline
                            />
                          </InputContainer>

                          {
                            (scorePointsValues || []).map((scorePointValue, index) => (
                              <InputContainer
                                key={`score_point_descriptor_${scorePointValue}`}
                                label={`Score Point Descriptor - ${scorePointValue}`}
                                className={classes.promptHolder}
                              >
                                <EditableHtml
                                  className={classes.prompt}
                                  markup={scorePointsDescriptors[index] || ''}
                                  onChange={prompt => this.onScorePointDescriptorChanged(scaleIndex, traitIndex, index, prompt)}
                                  disableUnderline
                                />
                              </InputContainer>
                            ))
                          }

                          <InputContainer
                            label='Weighting:'
                            className={classes.promptHolder}
                          >
                            <EditableHtml
                              className={classes.prompt}
                              markup={weighting || ''}
                              onChange={prompt => this.onTraitPropertyChanged({
                                scaleIndex,
                                traitIndex,
                                newValue: prompt,
                                property: 'weighting'
                              })}
                              disableUnderline
                            />
                          </InputContainer>
                        </div>
                      );
                    })
                  }


                  <Button
                    className={classes.addButton}
                    variant="contained"
                    color="primary"
                    onClick={() => this.onTraitAdded(scaleIndex)}
                  >
                    Add Trait
                  </Button>
                </div>


                <div className={classes.authoringColumn}>
                  <Authoring
                    value={{
                      points: scale.scorePointsLabels,
                      maxPoints: scale.maxPoints,
                      excludeZero: scale.excludeZero
                    }}
                    onChange={(params) => this.onScaleChanged(scaleIndex, params)}
                  />
                </div>
              </div>
            </div>
          );
        })}

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
