import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { LvlzProvider } from './context/lvlz';
import { /* Home, */ Calendar, Timeline, Search, NotFound } from './routes';

import 'reset.css';
import './App.scss';

const nowDate = new Date();
const currentYear = nowDate.getYear() + 1900;
const currentMonth = nowDate.getMonth() + 1;
const currentDate = nowDate.getDate();

const App = () => (
  <LvlzProvider>
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/" component={ Home } /> */}
        <Route exact path="/" render={() => {
          return <Redirect to={ `/calendar/${ currentYear }/${ currentMonth }/${ currentDate }` } />;
        }} />
        <Route exact path="/calendar" render={() => {
          return <Redirect to={ `/calendar/${ currentYear }/${ currentMonth }/${ currentDate }` } />;
        }} />
        <Route exact path="/calendar/:Y([0-9]{4})" render={(props) => {
          let Y = Number(props.match.params.Y);
          let isThisYear = Y === currentYear;

          return isThisYear
          ? <Redirect to={ `/calendar/${ currentYear }/${ currentMonth }/${ currentDate }` } />
          : <Redirect to={ `/calendar/${ Y < 2000 ? 2000 : Y > 2100 ? currentYear : Y }/1/1` } />
        }} />
        <Route exact path="/calendar/:Y([0-9]{4})/:M([0-9]{1,2})" render={(props) => {
          let Y = Number(props.match.params.Y);
          let M = Number(props.match.params.M);
          let isThisYear = Y === currentYear;
          let isThisMonth = M === currentMonth;

          return isThisYear && isThisMonth
          ? <Redirect to={ `/calendar/${ currentYear }/${ currentMonth }/${ currentDate }` } />
          : <Redirect to={ `/calendar/${ Y < 2000 ? 2000 : Y > 2100 ? currentYear : Y }/${ M < 1 ? 1 : M > 12 ? 12 : M > 10 && M.length === 2 ? M.substring(1, 1) : M }/1` } />;
        }} />
        <Route exact path="/calendar/:Y([0-9]{4})/:M([0-9]{1,2})/:D([1-9]|[1-2][0-9]|3[0-1])" component={ Calendar } />
        {/* <Route exact path="/calendar/:Y/:M/:D" component={ Calendar } /> */}
        {/* <Route exact path="/calendar" component={ Calendar } /> */}
        <Route exact path="/timeline" component={ Timeline } />
        <Route exact path="/search" component={ Search } />
        <Route component={ NotFound } />
      </Switch>
    </BrowserRouter>
  </LvlzProvider>
)

// function lastDateOfMonth (Y, M) {
//   return new Date(Y, M, 0).getDate();
// }

export default App;