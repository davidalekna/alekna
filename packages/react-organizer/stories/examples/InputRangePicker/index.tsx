import React from 'react';
import Organizer from '../../..';
import { addMonths, getMonth } from 'date-fns';
import { FlexRow } from '../globals';
import {
  Wrapper,
  SelectedDatesPreview,
  FakeInput,
  DoubleCalendar,
  CalendarWrapper,
  Toolbar,
  Grid,
  GridItem,
  Day,
  Button,
} from './styles';

function getSelectedDate(dates, num) {
  return (
    (dates &&
      dates.length > 0 &&
      dates[num] &&
      dates[num].toLocaleDateString()) ||
    'not select'
  );
}

export const InputRangePicker = () => (
  <Organizer
    onSelectRange={state => {
      return state;
    }}
  >
    {({
      days,
      months,
      now,
      getFullMonth,
      selectRange,
      selected,
      reset,
      subCalendarMonth,
      addCalendarMonth,
    }) => (
      <Wrapper>
        <SelectedDatesPreview>
          <FlexRow>
            <FakeInput>From: {getSelectedDate(selected, 0)}</FakeInput>
            <FakeInput>Until: {getSelectedDate(selected, 1)}</FakeInput>
          </FlexRow>
          <button onClick={reset}>RESET</button>
        </SelectedDatesPreview>
        <DoubleCalendar>
          <CalendarWrapper>
            <Toolbar>
              <Button left={0} onClick={subCalendarMonth}>
                PREV
              </Button>
              {`${months[now.getMonth()]} ${now.getFullYear()}`}
            </Toolbar>
            <Grid>
              {days.map((day, index) => (
                <GridItem key={index} darker>
                  {day.slice(0, 1)}
                </GridItem>
              ))}
              {getFullMonth().days.map((day, index) => (
                <GridItem key={index} darker={day.status.offset}>
                  <Day
                    current={day.status.today}
                    hoverable={!day.status.offset}
                    selected={day.status.selected}
                    past={day.status.past}
                    onClick={() => {
                      if (!day.status.offset && !day.status.past) {
                        selectRange({ date: day.date });
                      }
                    }}
                  >
                    {day.day}
                  </Day>
                </GridItem>
              ))}
            </Grid>
          </CalendarWrapper>
          <CalendarWrapper>
            <Toolbar>
              {`${months[addMonths(now, 1).getMonth()]} ${addMonths(
                now,
                1,
              ).getFullYear()}`}
              <Button right={0} onClick={addCalendarMonth}>
                NEXT
              </Button>
            </Toolbar>
            <Grid>
              {days.map((day, index) => (
                <GridItem key={index} darker>
                  {day.slice(0, 1)}
                </GridItem>
              ))}
              {getFullMonth(getMonth(now) + 2).days.map((day, index) => (
                <GridItem key={index} darker={day.status.offset}>
                  <Day
                    current={day.status.today}
                    hoverable={!day.status.offset}
                    selected={day.status.selected}
                    past={day.status.past}
                    onClick={() => {
                      if (!day.status.offset && !day.status.past) {
                        selectRange({ date: day.date });
                      }
                    }}
                  >
                    {day.day}
                  </Day>
                </GridItem>
              ))}
            </Grid>
          </CalendarWrapper>
        </DoubleCalendar>
      </Wrapper>
    )}
  </Organizer>
);
