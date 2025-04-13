import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type Props = {
  isDisconnected: boolean;
};

const SocketDisconnectModal: React.FC<Props> = ({ isDisconnected }) => {
  return (
    <Modal
      open={isDisconnected}
      closable={false}
      footer={null}
      centered
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          Socket Disconnected
        </span>
      }
    >
      <p>Your connection to the server was lost.</p>
      <p>Please reload to rejoin the chat.</p>

      <Button className='mt-6' type="primary" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </Modal>
  );
};

export default SocketDisconnectModal;
