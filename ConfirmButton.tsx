import React, { useState } from 'react';
import { Text } from 'react-native';
import PropTypes, { InferProps } from 'prop-types';

import Button from './Button';
import Modal from './Modal';

const propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  label: PropTypes.string,
  onOk: PropTypes.func,
  textContent: PropTypes.string,
  loading: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const defaultProps = {
  children: 'Xác nhận',
};

type Props = InferProps<typeof propTypes>;

function ConfirmButton(props: Props) {
  const { children, label, content, onOk, textContent, loading, size, type, style } = props;
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <Button size={size} type={type} style={style} onPress={() => setShowModal(true)}>
        {children || label}
      </Button>
      <Modal titleModal="Xác nhận" visible={showModal} onDismiss={() => setShowModal(false)} onOk={onOk} loadingOk={loading}>
        {content || <Text style={{ fontFamily: 'Roboto_500Medium', textAlign: 'center' }}>{textContent}</Text>}
      </Modal>
    </>
  );
}

ConfirmButton.propTypes = propTypes;
ConfirmButton.defaultProps = defaultProps;

export default ConfirmButton;
