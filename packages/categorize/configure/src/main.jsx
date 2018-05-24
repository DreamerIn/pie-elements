import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Tabs } from '@pie-lib/config-ui';
import Design from './design';
import Scoring from './scoring';

export class Main extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    model: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {};

  changeScoring = scoring => {
    const { onChange, model } = this.props;
    model.scoring = scoring;
    onChange(model);
  };

  render() {
    const { classes, className, model, onChange } = this.props;
    return (
      <div className={classNames(classes.main, className)}>
        <Tabs>
          <Design title="Design" model={model} onChange={onChange} />
          <Scoring
            title="Scoring"
            scoring={model.scoring}
            categories={model.categories}
            correctResponse={model.correctResponse}
            onChange={this.changeScoring}
          />
        </Tabs>
      </div>
    );
  }
}
const styles = theme => ({
  main: {}
});

const StyledMain = withStyles(styles)(Main);

class Stateful extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ model: props.model });
  }

  onChange = model => {
    this.setState({ model }, () => {
      this.props.onChange(this.state.model);
    });
  };

  render() {
    return <StyledMain model={this.state.model} onChange={this.onChange} />;
  }
}

export default Stateful;