import React from 'react';
import Organizer from '../../..';
import { Wrapper, Toolbar } from './styles';
import { Grid, Day, Title, Number } from './styles';
import { Button } from '../globals';

export const MonthCalendar = () => (
  <Organizer>
    {({
      now,
      days,
      months,
      getFullMonth,
      subCalendarMonth,
      addCalendarMonth,
      reset,
    }) => (
      <Wrapper>
        <Toolbar>
          <div>
            {months[now.getMonth()]} {now.getFullYear()}
          </div>
          <div>
            <Button onClick={subCalendarMonth}>Sub</Button>
            <Button onClick={reset} style={{ margin: '0 10px' }}>
              Today
            </Button>
            <Button onClick={addCalendarMonth}>Add</Button>
          </div>
        </Toolbar>
        <Grid>
          {getFullMonth().days.map((day, index) => (
            <Day
              key={index}
              isOffset={day.offset}
              isToday={day.today}
              isSelected={day.selected}
            >
              <Title>{days[index] && days[index].slice(0, 3)}</Title>
              <Number isToday={day.today}>
                {day.day} {day.today && `🌞`}
              </Number>
            </Day>
          ))}
        </Grid>
      </Wrapper>
    )}
  </Organizer>
);
