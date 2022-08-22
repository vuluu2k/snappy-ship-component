import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import Colors from './Colors';

type Props = { style?: object | Array<object>; styleClock?: object | Array<object>; styleDate?: object | Array<object>; showDate?: boolean };

function Clock(props: Props) {
  const { style, styleClock, styleDate, showDate } = props;

  const [timeClock, setTimeClock] = useState(new Date());
  const realTimeClock = () => setTimeClock(new Date(timeClock.valueOf() + 1000));
  useEffect(() => {
    const id = setInterval(realTimeClock, 1000);
    return () => clearInterval(id);
  }, [timeClock]);

  return (
    <View style={[styles.container, style]}>
      {showDate && <Text style={[styles.date, styleDate]}>Ngày: {dayjs(timeClock).format('DD.MM.YYYY')}</Text>}
      <Text style={[styles.clock, styleClock]}>{dayjs(timeClock).format('HH:mm:ss')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  clock: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 30,
    lineHeight: 40,
  },
  date: {
    color: Colors.gray_4,
    fontFamily: 'Roboto_500Medium',
    marginBottom: 4,
  },
});

export default Clock;
