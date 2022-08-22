import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';

LocaleConfig.locales['vn'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['Th.1', 'Th.2', 'Th.3', 'Th.4', 'Th.5', 'Th.6', 'Th.7', 'Th.8', 'Th.9', 'Th.10', 'Th.11', 'Th.12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};

LocaleConfig.defaultLocale = 'vn';

import CommonStyle from './CommonStyle';
import Colors from './Colors';
import Modal from './Modal';
import ButtonListSelect from './ButtonListSelect';

const listShifts = [
  { key: 'morning', text: 'Sáng' },
  { key: 'afternoon', text: 'Chiều' },
  { key: 'evening', text: 'Tối' },
];

const propTypes = {
  placeholder: PropTypes.string,
  visible: PropTypes.bool,
  dateValue: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  dateFormat: PropTypes.string,
  markingStyle: PropTypes.object,
  styleTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabelTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
};

const defaultProps = {
  placeholder: undefined,
  visible: false,
  dateValue: undefined,
  dateFormat: 'DD/MM/YYYY',
  markingStyle: { color: Colors.logo_snappy, textColor: '#fff' },
};

type IProps = InferProps<typeof propTypes> & { dateFormat?: any };
type IState = {
  visible?: boolean | undefined | null;
  dateValue?: any;
  shift: string;
};
export default class DatePicker extends Component<IProps, IState> {
  static propTypes = {};
  static defaultProps = {};
  mounted: boolean | undefined;
  constructor(props: IProps) {
    super(props);
    this.state = {
      visible: props.visible,
      dateValue: (props.dateValue && dayjs(props.dateValue).format('YYYY-MM-DD')) || undefined,
      shift: '',
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onDayPress = (date: any) => {
    const { onChange } = this.props;
    if (onChange) onChange(date.dateString);
    this.mounted && this.setState({ dateValue: date?.dateString });
  };

  onShowModalDatePicker = () =>
    this.mounted && this.setState({ visible: true, dateValue: this.state.dateValue || dayjs().format('YYYY-MM-DD'), shift: 'morning' });
  onHiddenModalDatePicker = () => this.mounted && this.setState({ visible: false });
  onCancel = () => {
    const { dateValue } = this.props;
    this.mounted && this.setState({ visible: false, dateValue: dateValue || undefined });
  };

  render() {
    const { placeholder, onSubmit, dateFormat, markingStyle, onChange, title, styleTitle, styleLabelTitle } = this.props;
    const { visible, dateValue, shift } = this.state;

    const shiftDate = listShifts.find(item => item.key === shift);

    return (
      <View>
        {title && (
          <View style={[{ marginBottom: 8 }, styleTitle]}>
            <Text style={[{ fontWeight: '500', lineHeight: 22 }, styleLabelTitle]}>{title}</Text>
          </View>
        )}
        <TouchableOpacity onPress={this.onShowModalDatePicker}>
          <View style={[CommonStyle.d_flex_start, CommonStyle.border_input]}>
            <AntDesign name="calendar" size={16} color="black" />
            <Text style={{ marginLeft: 8, lineHeight: 24 }}>
              {shift && shiftDate?.text} {(dateValue && dayjs(dateValue).format(dateFormat)) || placeholder || 'Chọn ngày, tháng, năm'}
            </Text>
          </View>
        </TouchableOpacity>
        <Modal
          visible={visible}
          onDismiss={(onChange && this.onHiddenModalDatePicker) || this.onCancel}
          hiddenTitle
          onCancel={(onChange && this.onHiddenModalDatePicker) || this.onCancel}
          onOk={() => {
            onSubmit && onSubmit(dateValue, shiftDate);
            this.onHiddenModalDatePicker();
          }}>
          <View style={{ padding: 16 }}>
            <Calendar
              renderArrow={direction => <MaterialIcons name={`keyboard-arrow-${direction}`} size={16} color="black" />}
              // @ts-ignore
              markedDates={{
                [dateValue]: markingStyle,
              }}
              dayComponent={({ date, state, marking }: any) => {
                return (
                  <TouchableOpacity onPress={() => state !== 'disabled' && this.onDayPress(date)}>
                    <View
                      style={{
                        backgroundColor: marking?.color || '#fff',
                        width: 36,
                        height: 36,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: marking?.textColor || state === 'disabled' ? '#f0f0f0' : '#262626',
                        }}>
                        {date.day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              enableSwipeMonths={true}
              theme={{
                // @ts-ignore
                'stylesheet.calendar.main': {
                  week: {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    margin: 0,
                  },
                  day: {
                    padding: 0,
                    margin: 0,
                  },
                },
              }}
            />
            <ButtonListSelect cols={3} value={shift} options={listShifts} onChange={event => this.setState({ shift: event.key })} />
          </View>
        </Modal>
      </View>
    );
  }
}

DatePicker.propTypes = propTypes;

DatePicker.defaultProps = defaultProps;
