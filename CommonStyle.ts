import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  // lib
  d_flex_between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  d_flex_center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  d_flex_start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flex_start: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  d_flex_row: { flexDirection: 'row' },
  d_flex_col: { flexDirection: 'column' },

  border_input: { borderWidth: 1, borderColor: Colors.color_border, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },

  d_flex_start_start: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  d_flex_around_center: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // vh_full: {
  //   height: height,
  // },

  // vw_full: {
  //   width: width,
  // },

  //------------------ color-text ----------------
  color_key: {
    color: Colors.color_key,
  },

  //-------------- text ----------------
  text_default: {
    fontSize: 14,
    lineHeight: 22,
  },

  //--------------- font-weight --------------
  fw_500: {
    fontWeight: '500',
  },
  fw_700: {
    fontWeight: '700',
  },

  //-------------- margin ------------
  // top
  mt_12: {
    marginTop: 12,
  },

  mr_24: {
    marginRight: 24,
  },

  //--------------flex-----------------
  fl_1: {
    flex: 1,
  },
});
