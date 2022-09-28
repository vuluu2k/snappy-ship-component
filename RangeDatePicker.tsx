import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import PropTypes, { InferProps } from 'prop-types';
import { Calendar } from 'react-native-calendars';
const XDate = require('xdate');

import { Notification } from '@components/SnyNotification';
import Colors from './Colors';
import Button from './Button';
import CheckBox from './CheckBox';
import Modal from './Modal';
import Divider from './Divider';

const deviceWidth = Dimensions.get('window').width;

const formatDate = 'DD/MM/YYYY';
const formatDateMarked = 'YYYY-MM-DD';

const subtractDate = (days: any) => dayjs().subtract(days, 'day').startOf('day');
const formatMarked = (day: any) => dayjs(day).format(formatDateMarked);
const formatDateValue = (day: any) => dayjs(day).valueOf();

const endToDay = dayjs().endOf('day');
const toDay = dayjs().startOf('day');
const yesterday = subtractDate(1);
const week = dayjs().startOf('week');
const lastWeek = subtractDate(7).startOf('week');
const endLastWeek = subtractDate(7).endOf('week');
const before07day = subtractDate(7);
const before30Day = subtractDate(30);
const before60Day = subtractDate(60);
const moth = dayjs().startOf('month').startOf('day');
const endMoth = dayjs().endOf('month').endOf('day');
const lastMoth = dayjs().subtract(1, 'months').startOf('month');
const endLastMonth = dayjs().subtract(1, 'months').endOf('month');

const propTypes = {
  startDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  endDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  visibleStart: PropTypes.bool,
  visibleEnd: PropTypes.bool,
  theme: PropTypes.object,
  onChange: PropTypes.func,
  showSelectDay: PropTypes.bool,
  showCheckBoxDay: PropTypes.array,
  showButton: PropTypes.bool,
  onSubmit: PropTypes.func,
  openPicker: PropTypes.bool,
  defaultWeek: PropTypes.string,
};

const defaultProps = {
  startDate: dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  style: {},
  visibleStart: false,
  visibleEnd: false,
  theme: {
    markColor: '#100f1c',
    markTextColor: '#ffffff',
    markCenterColor: '#ababb0',
    markTextCenterColor: '#fff',
  },
  onChange: (startDate: string | number, endDate: string | number) => console.log(startDate, ' - ', endDate),
  showSelectDay: true,
  showCheckBoxDay: ['seven_days', 'month', 'thirty_days', 'sixty_days', 'to_day', 'yesterday'],
  showButton: false,
  openPicker: true,
};

type IProps = InferProps<typeof propTypes> & { theme: any };
type IState = {
  keyVn: string | undefined;
  keyEng: string | undefined;
  startDate: string | number;
  endDate: string | number;
  showModalStartDate: boolean;
  showModalEndDate: boolean;
  markedDates: any;
  option: string | number | undefined;
  selectCheckBox: any;
  openPicker: boolean;
};

export default class RangeDatePicker extends Component<IProps, IState> {
  static propTypes: any;
  static defaultProps: any;
  mounted: boolean | undefined;
  constructor(props: IProps) {
    super(props);
    this.state = {
      keyVn: undefined,
      keyEng: undefined,
      startDate: formatMarked(props.startDate) || dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD'),
      endDate: formatMarked(props.endDate) || dayjs().format('YYYY-MM-DD'),
      showModalStartDate: props.visibleStart || false,
      showModalEndDate: props.visibleEnd || false,
      markedDates: {},
      option: undefined,
      selectCheckBox: undefined,
      openPicker: props.openPicker || false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setupInitialRange();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { startDate, endDate } = this.state;
    if (prevState.startDate !== startDate || prevState.endDate !== endDate) {
      this.setupInitialRange();
    }
  }

  onHiddenModal = () => this.mounted && this.setState({ showModalStartDate: false, showModalEndDate: false });

  onSelectDate = (option: string | number | undefined) => {
    if (option === 'start') this.mounted && this.setState({ showModalStartDate: true, option: option });
    else this.mounted && this.setState({ showModalEndDate: true, option: option });
  };

  onPutDate = () => {
    const { startDate, endDate, option } = this.state;
    const { onChange } = this.props;
    if (option === 'start') {
      Notification.success('Bạn đã đặt ngày bắt đầu');
      this.setState({ option: 'end', showModalStartDate: false, showModalEndDate: true });
    } else if (onChange) {
      Notification.success('Đặt ngày thành công');
      onChange(formatDateValue(startDate), formatDateValue(endDate));
      this.onHiddenModal();
    }
  };

  onSelectCheckBox = (rangeDays: string) => {
    const { onChange, showButton } = this.props;
    this.mounted && this.setState({ selectCheckBox: rangeDays });
    if (onChange) {
      if (rangeDays === 'seven_days') {
        !showButton && onChange(formatDateValue(before07day), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({
            startDate: formatMarked(before07day),
            endDate: formatMarked(endToDay),
            keyVn: this.cvtLabel(rangeDays),
            keyEng: rangeDays,
          });
      }
      if (rangeDays === 'month') {
        !showButton && onChange(formatDateValue(moth), formatDateValue(endMoth), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({ startDate: formatMarked(moth), endDate: formatMarked(endMoth), keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
      }
      if (rangeDays === 'thirty_days') {
        !showButton && onChange(formatDateValue(before30Day), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({
            startDate: formatMarked(before30Day),
            endDate: formatMarked(endToDay),
            keyVn: this.cvtLabel(rangeDays),
            keyEng: rangeDays,
          });
      }
      if (rangeDays === 'sixty_days') {
        !showButton && onChange(formatDateValue(before60Day), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({
            startDate: formatMarked(before60Day),
            endDate: formatMarked(endToDay),
            keyVn: this.cvtLabel(rangeDays),
            keyEng: rangeDays,
          });
      }
      if (rangeDays === 'to_day') {
        !showButton && onChange(formatDateValue(toDay), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({ startDate: formatMarked(toDay), endDate: formatMarked(endToDay), keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
      }
      if (rangeDays === 'yesterday') {
        !showButton && onChange(formatDateValue(yesterday), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({ startDate: formatMarked(yesterday), endDate: formatMarked(endToDay), keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
      }
      if (rangeDays === 'week') {
        !showButton && onChange(formatDateValue(week), formatDateValue(endToDay), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({ startDate: formatMarked(week), endDate: formatMarked(endToDay), keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
      }
      if (rangeDays === 'last_week') {
        !showButton && onChange(formatDateValue(lastWeek), formatDateValue(endLastWeek), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({
            startDate: formatMarked(lastWeek),
            endDate: formatMarked(endLastWeek),
            keyVn: this.cvtLabel(rangeDays),
            keyEng: rangeDays,
          });
      }
      if (rangeDays === 'last_month') {
        !showButton && onChange(formatDateValue(lastMoth), formatDateValue(endLastMonth), { keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
        this.mounted &&
          this.setState({
            startDate: formatMarked(lastMoth),
            endDate: formatMarked(endLastMonth),
            keyVn: this.cvtLabel(rangeDays),
            keyEng: rangeDays,
          });
      }
      if (rangeDays === 'custom_day') {
        this.mounted && this.setState({ openPicker: true, keyVn: this.cvtLabel(rangeDays), keyEng: rangeDays });
      }
    }
  };

  renderItemDateBox = (item: any, option: string | number | undefined) => {
    return (
      <TouchableOpacity onPress={() => this.onSelectDate(option)}>
        <View style={[styles.box_date, this.state.option === option && { borderColor: Colors.daybreak_blue_6 }]}>
          <Text>{dayjs(item).format(formatDate)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  onDayPress = (day: any) => {
    const { option, startDate, endDate } = this.state;
    if (option === 'start')
      this.mounted && this.setState({ startDate: day.dateString, endDate: (day.dateString > endDate && day.dateString) || endDate });
    else this.mounted && this.setState({ endDate: day.dateString, startDate: (day.dateString < startDate && day.dateString) || startDate });
  };

  setupMarkedDates = (fromDate: any, toDate: any, markedDates: any) => {
    let mFromDate = new XDate(fromDate);
    let mToDate = new XDate(toDate);
    let range = mFromDate.diffDays(mToDate);
    if (range >= 0) {
      if (range == 0) {
        markedDates = { [toDate]: { color: this.props.theme.markColor, textColor: this.props.theme.markTextColor } };
      } else {
        for (var i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString('yyyy-MM-dd');
          if (i < range) {
            markedDates[tempDate] = { color: this.props.theme.markCenterColor, textColor: this.props.theme.markTextCenterColor };
          } else {
            markedDates[tempDate] = {
              endingDay: true,
              color: this.props.theme.markColor,
              textColor: this.props.theme.markTextColor,
            };
          }
        }
      }
    }
    return [markedDates, range];
  };

  setupInitialRange = () => {
    const {
      theme: { markColor, markTextColor },
    } = this.props;
    const { startDate, endDate } = this.state;
    let markedDates = {
      [startDate]: { startingDay: true, color: markColor, textColor: markTextColor },
    };
    let [mMarkedDates, range] = this.setupMarkedDates(startDate, endDate, markedDates);
    this.mounted && this.setState({ markedDates: mMarkedDates, startDate: startDate });
  };

  renderModalDatePicker = (showModal: any, currentDate: any, markedDates: any) => {
    return (
      <Modal visible={showModal} onDismiss={this.onHiddenModal} hiddenTitle>
        <Calendar
          current={currentDate}
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 20 }}
          renderArrow={direction => <MaterialIcons name={`keyboard-arrow-${direction}`} size={16} color="black" />}
          markingType={'period'}
          markedDates={markedDates}
          dayComponent={({ date, state, marking }) => {
            return (
              <TouchableOpacity onPress={() => state !== 'disabled' && this.onDayPress(date)}>
                <View
                  style={[
                    styles.day_container,
                    { backgroundColor: marking?.color || '#fff' },
                    marking?.startingDay && { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
                    marking?.endingDay && { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
                  ]}>
                  <Text style={{ color: marking?.textColor || (state === 'disabled' && '#BFBFBF') || '#262626' }}>{date?.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          theme={{
            // @ts-ignore
            'stylesheet.calendar.main': {
              week: {
                flexDirection: 'row',
                justifyContent: 'space-around',
                margin: 0,
              },
            },
          }}
        />
        <Divider />
        <View style={[styles.d_flex, { paddingVertical: 12, paddingHorizontal: 16 }]}>
          <Button text="Huỷ" size="lg" style={styles.button_modal} onPress={this.onHiddenModal} />
          <Button type="primary" size="lg" style={styles.button_modal} text="Đặt ngày" onPress={this.onPutDate} />
        </View>
      </Modal>
    );
  };

  cvtLabel = (value: string) => {
    switch (value) {
      case 'to_day': {
        return 'Hôm nay';
      }

      case 'yesterday': {
        return 'Hôm qua';
      }

      case 'week': {
        return 'Tuần này';
      }

      case 'last_week': {
        return 'Tuần trước';
      }

      case 'month': {
        return 'Tháng này';
      }

      case 'last_month': {
        return 'Tháng trước';
      }

      case 'seven_days': {
        return '7 ngày  trước';
      }

      case 'thirty_days': {
        return '30 ngày trước';
      }

      case 'sixty_days': {
        return '60 ngày trước';
      }

      case 'custom_day': {
        return 'Tuỳ chọn';
      }

      default: {
        return 'Tuần này';
      }
    }
  };

  resetFilter = () => {
    const { defaultWeek, openPicker } = this.props;
    if (defaultWeek) {
      this.mounted &&
        this.setState({ startDate: formatMarked(week), endDate: formatMarked(endToDay), selectCheckBox: undefined, openPicker: openPicker || false });
    } else {
      this.mounted && this.setState({ startDate: formatMarked(before30Day), endDate: formatMarked(endToDay), openPicker: openPicker || false });
    }
  };

  render() {
    const { style, showSelectDay, showCheckBoxDay, showButton, onSubmit } = this.props;
    const { startDate, endDate, showModalStartDate, showModalEndDate, markedDates, selectCheckBox, option, openPicker, keyEng, keyVn } = this.state;

    return (
      <>
        <View style={style}>
          {showSelectDay && (
            <View style={[styles.d_flex, { flexWrap: 'wrap', paddingHorizontal: 24, marginBottom: 8 }]}>
              {showCheckBoxDay?.map((select, index) => {
                return (
                  <CheckBox
                    key={index}
                    checked={selectCheckBox === select}
                    onChange={() => this.onSelectCheckBox(select)}
                    style={{ minWidth: 118, maxWidth: '48%', marginBottom: 8 }}
                    label={this.cvtLabel(select)}
                    labelCenter
                  />
                );
              })}
            </View>
          )}
          {openPicker && (
            <View style={[styles.d_flex, { marginBottom: 16 }]}>
              {this.renderItemDateBox(startDate, 'start')}
              <AntDesign name="arrowright" size={20} color={Colors.gray_3} />
              {this.renderItemDateBox(endDate, 'end')}
            </View>
          )}
        </View>
        {showButton && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.button} onPress={this.resetFilter}>
              <View>
                <Text>Thiết lập lại</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectCheckBox !== undefined && { backgroundColor: Colors.logo_snappy }]}
              onPress={() => onSubmit && onSubmit({ keyVn: keyVn, keyEng: keyEng }, formatDateValue(startDate), formatDateValue(endDate))}
              disabled={selectCheckBox === undefined}>
              <View>
                <Text style={selectCheckBox === undefined ? { color: Colors.gray_2 } : { color: '#fff' }}>Áp dụng</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {this.renderModalDatePicker(showModalStartDate, startDate, markedDates)}
        {this.renderModalDatePicker(showModalEndDate, endDate, markedDates)}
      </>
    );
  }
}

RangeDatePicker.propTypes = propTypes;

RangeDatePicker.defaultProps = defaultProps;

const styles = StyleSheet.create({
  d_flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  d_checkbox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },

  style_modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  box_date: {
    borderWidth: 1,
    borderColor: Colors.gray_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: deviceWidth / 2 - 40,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '48%',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(217, 219, 234, 0.3)',
  },

  day_container: {
    width: 56,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button_modal: {
    minWidth: deviceWidth / 2 - 20,
  },
});
