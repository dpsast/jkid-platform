import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import ValidatorTextField from '../components/ValidatorTextField';
import trpc from '../shared/trpc';

function base64ToText(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const requestId = searchParams.get('requestId');
  const base64Payload = searchParams.get('base64Payload');
  if (!requestId || !base64Payload) return 'Something went wrong.';
  const { realName, username, studentId, email } = JSON.parse(base64ToText(base64Payload)) as {
    realName: string;
    username: string;
    studentId: string;
    email: string;
  };

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant={'h5'}>注册</Typography>
      </Box>
      <Typography>以下的信息是由系统自动生成的，无法修改。</Typography>
      <TextField label={'真实姓名'} value={realName} />
      <TextField label={'学号'} value={studentId} />
      <TextField label={'用户名'} value={username} />
      <TextField label={'邮箱'} value={email} />

      <Typography>由于我们无法确认你是否为物理系 / 致理书院物理方向的同学，请你补充填写你的院系和注册理由。</Typography>

      <TextField label={'院系'} onBlur={(e) => setDepartment(e.target.value)} />
      <TextField label={'注册理由'} multiline rows={4} onBlur={(e) => setReason(e.target.value)} />

      <Typography>
        请设置账户的密码，至少 8 个字符。请注意这是一个<b>临时</b>密码，在审核通过第一次登录时依然会要求你修改密码。
        <br />
        <b>建议使用弱密码</b>，以便记忆。<b>不建议使用常用密码</b>，避免隐私泄露。
      </Typography>
      <ValidatorTextField
        label={'密码'}
        type={'password'}
        validator={(input) => (input.length >= 8 ? { isValid: true } : { isValid: false, hint: '密码过短' })}
        setValid={setPasswordValid}
        onValidationPass={setPassword}
      />
      <ValidatorTextField
        label={'确认密码'}
        type={'password'}
        frequency={'onChange'}
        validator={(input) =>
          input === password ? { isValid: true } : { isValid: false, hint: '两次输入的密码不一致' }
        }
        setValid={setConfirmed}
      />

      <Button
        variant={'outlined'}
        size={'large'}
        disabled={!(passwordValid && confirmed)}
        onClick={async () => {
          const base64Payload = searchParams.get('base64Payload');
          if (!base64Payload) return;
          try {
            await trpc.register.submit.mutate({ requestId, password, department, reason });
            navigate('/submitted-pending');
          } catch (error) {
            console.error('Error during registration:', error);
          }
        }}
      >
        提交
      </Button>
    </>
  );
}

export default Register;
