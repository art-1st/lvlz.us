import React, { createContext } from 'react';
import moment from 'moment';
import createUseConsumer from '../lib/createUseConsumer';

const Context = createContext();
const { Provider, Consumer: LvlzConsumer } = Context;



class LvlzProvider extends React.Component {
  state = {
    nowDate: moment().format('YYYY-MM-DD'),
    nowYear: moment().format('YYYY'),
    nowMonth: moment().format('M'),
    nowDay: moment().format('D'),
    fcDate: moment().format('YYYY-MM-DD'),
  }
  
  actions = {
    setFcDate: (date) => {
      this.setState({
        fcDate: date
      });
    }
  }
  
  render() {
    const { state, actions } = this;
    const value = { state, actions };

    return (
      <Provider value={ value }>
        { this.props.children }
      </Provider>
    )
  }
}

const withLvlz = createUseConsumer(LvlzConsumer);
  
export {
  LvlzProvider,
  LvlzConsumer,
  withLvlz
};