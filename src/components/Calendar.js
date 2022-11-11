import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getMonth, getDeclinedMonth, getRussianWeekDayName } from '../russian';

const propTypes = {
  date: PropTypes.instanceOf(Date),
};

const monday = 1;
const sunday = 0;

function getStartDate(date) {
  const startDate = new Date(date);
  startDate.setDate(1); // начало текущего месяца
  let shift = startDate.getDay() - monday;
  if (shift < 0) {
    shift += 7;
  }
  startDate.setDate(startDate.getDate() - shift); // начало календаря
  return startDate;
}

function getFinishDate(date) {
  const finishDate = new Date(date);
  finishDate.setDate(1); // начало текущего месяца
  finishDate.setMonth(finishDate.getMonth() + 1); // начало следующего месяца
  finishDate.setDate(0); // конец текущего месяца
  let shift = sunday - finishDate.getDay();
  if (shift < 0) {
    shift += 7;
  }
  finishDate.setDate(finishDate.getDate() + shift); // конец календаря
  return finishDate;
}

function useRange(startDate, finishDate) {
  return useMemo(() => {
    if (startDate > finishDate) {
      return [];
    }
    const range = [];
    for (
      const date = new Date(startDate);
      date <= finishDate;
      date.setDate(date.getDate() + 1)
    ) {
      range.push(new Date(date));
    }
    return range;
  }, [startDate, finishDate]);
}

function useWeeks(range) {
  return useMemo(() => {
    const result = [];
    for (const date of range) {
      if (date.getDay() === monday) {
        result.push([]);
      }
      result[result.length - 1].push(date);
    }
    return result;
  }, [range]);
}

function Calendar({ date }) {
  const startDate = useMemo(() => getStartDate(date), [date]);
  const finishDate = useMemo(() => getFinishDate(date), [date]);
  const range = useRange(startDate, finishDate);
  const weeks = useWeeks(range);

  function getClassName(d) {
    if (d.getMonth() !== date.getMonth()) {
      return 'ui-datepicker-other-month';
    }
    if (d.getDate() === date.getDate()) {
      return 'ui-datepicker-today';
    }
  }

  return (
    <div className="ui-datepicker">
      <div className="ui-datepicker-material-header">
        <div className="ui-datepicker-material-day">
          {getRussianWeekDayName(date.getDay())}
        </div>
        <div className="ui-datepicker-material-date">
          <div className="ui-datepicker-material-day-num">{date.getDate()}</div>
          <div className="ui-datepicker-material-month">
            {getDeclinedMonth(date.getMonth())}
          </div>
          <div className="ui-datepicker-material-year">
            {date.getFullYear()}
          </div>
        </div>
      </div>
      <div className="ui-datepicker-header">
        <div className="ui-datepicker-title">
          <span className="ui-datepicker-month">
            {getMonth(date.getMonth())}
          </span>
          &nbsp;
          <span className="ui-atepicker-year">{date.getFullYear()}</span>
        </div>
      </div>
      <table className="ui-datepicker-calendar">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col className="ui-datepicker-week-end" />
          <col className="ui-datepicker-week-end" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" title="Понедельник">
              Пн
            </th>
            <th scope="col" title="Вторник">
              Вт
            </th>
            <th scope="col" title="Среда">
              Ср
            </th>
            <th scope="col" title="Четверг">
              Чт
            </th>
            <th scope="col" title="Пятница">
              Пт
            </th>
            <th scope="col" title="Суббота">
              Сб
            </th>
            <th scope="col" title="Воскресенье">
              Вс
            </th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <tr key={index}>
              {week.map((d) => (
                <td key={d.getDay()} className={getClassName(d)}>
                  {d.getDate()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Calendar.propTypes = propTypes;

export default Calendar;
