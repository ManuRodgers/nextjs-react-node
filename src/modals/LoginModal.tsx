import NiceModal, { antdModal, useModal } from '@ebay/nice-modal-react';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Space, Typography } from 'antd';
import { memo, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import * as yup from 'yup';

import CountDown from '@/components/CountDown';

const { Link } = Typography;
type FormDataProps = { phone: string; verifyCode: string };
const schema = yup
  .object({
    phone: yup.string().required(),
    verifyCode: yup.string().required(),
  })
  .required();

const LoginModal = NiceModal.create(() => {
  const [showCountDown, setShowCountDown] = useState<boolean>(false);
  const modal = useModal();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormDataProps>({
    resolver: yupResolver(schema),
  });

  const phone = watch('phone');

  const handleCountDownFinish = useCallback(() => {
    setShowCountDown(false);
  }, []);

  const handleGetVerifyCodeClick = useCallback(() => {
    // +61 0451 962 387
    if (!phone) {
      return message.warning('Please enter a phone number');
    }
    setShowCountDown(true);
  }, [phone]);

  return (
    <Modal
      {...antdModal(modal)}
      title='Mobile Phone Login'
      footer={null}
      width={400}
    >
      <Form
        onSubmitCapture={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <StyledPhoneInput
          control={control}
          name='phone'
          placeholder='Mobile Phone Number'
          rules={{ required: true }}
        />
        <p>{errors.phone ? 'Please enter a valid phone number' : ''}</p>
        <Controller
          control={control}
          name='verifyCode'
          render={({ field }) => (
            <StyledVerifyCodeInput
              {...field}
              placeholder='Verify Code'
              suffix={
                showCountDown ? (
                  <CountDown time={5} onFinish={handleCountDownFinish} />
                ) : (
                  <StyledPrimaryTextButton
                    type='text'
                    onClick={handleGetVerifyCodeClick}
                  >
                    Get verify code
                  </StyledPrimaryTextButton>
                )
              }
            />
          )}
          rules={{ required: true }}
        />
        <p>{errors.verifyCode?.message}</p>
        <Button type='primary' htmlType='submit' block>
          Submit
        </Button>
      </Form>
      <Space
        direction='vertical'
        style={{
          marginTop: '10px',
        }}
      >
        <Link
          onClick={() => {
            console.log('github');
          }}
        >
          Github Login
        </Link>
        <Link
          onClick={() => {
            console.log('privacy policy');
          }}
        >
          Condition and Privacy Policy
        </Link>
      </Space>
    </Modal>
  );
});
export default memo(LoginModal);

const StyledPhoneInput = styled(PhoneInputWithCountry)`
  & > input.PhoneInputInput {
    border-radius: 2px;
    border-color: #d9d9d9;
    &:focus {
      border-color: #40a9ff;
      border-width: 0.5px;
    }
    &:hover {
      border-color: #40a9ff;
    }
  }
`;

const StyledVerifyCodeInput = styled(Input)`
  height: 42px;
  & > input[name='verifyCode'] {
    border-radius: 2px;
  }
`;

const StyledPrimaryTextButton = styled(Button)`
  & > span {
    color: #1890ff;
  }
`;
