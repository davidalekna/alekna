import React from 'react';
import Organizer from '../../..';
import { Grid, Wrapper, Toolbar } from './styles';
import { Button } from '../globals';
import CalendarBase from '../base';

export const YearCalendar = () => (
  <Organizer>
    {({
      now,
      getFullYear,
      selectDate,
      days,
      subCalendarYear,
      addCalendarYear,
      reset,
    }) => (
      <Wrapper>
        <Toolbar>
          <div>{now.getFullYear()}</div>
          <div>
            <Button onClick={subCalendarYear}>Sub</Button>
            <Button onClick={reset} style={{ margin: '0 10px' }}>
              Today
            </Button>
            <Button onClick={addCalendarYear}>Add</Button>
          </div>
        </Toolbar>
        <Grid>
          {getFullYear().map((month, key) => (
            <div key={key} style={{ padding: 15 }}>
              <CalendarBase
                {...{
                  month,
                  days,
                  showNav: false,
                  weekends: true,
                  onDayClick: date => selectDate({ date }),
                  renderToolbar: () => month.name,
                }}
              />
            </div>
          ))}
        </Grid>
      </Wrapper>
    )}
  </Organizer>
);
