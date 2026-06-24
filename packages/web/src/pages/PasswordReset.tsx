import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import ValidatorTextField from '../components/ValidatorTextField';
import trpc from '../shared/trpc';

function PasswordReset() {
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [requestedChange, setRequestedChange] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const requestId = searchParams.get('requestId');
  const username = searchParams.get('username');
  if (!requestId || !username) return 'Something went wrong.';

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant={'h5'}>重置密码</Typography>
      </Box>
      <Typography>如果你忘记了密码，可以在这里重设。</Typography>
      <TextField label={'用户名'} value={username} />
      <ValidatorTextField
        label={'新密码'}
        type={'password'}
        validator={(input) => (input.length >= 8 ? { isValid: true } : { isValid: false, hint: '密码过短' })}
        setValid={setPasswordValid}
        onValidationPass={setPassword}
      />
      {resetSuccess ? (
        <Alert severity={'success'}>
          密码重置成功！请回到 <Link href="https://git.dpsast.org">Gitea 平台</Link> 登录。
        </Alert>
      ) : resetError ? (
        <Alert severity={'error'}>密码重置失败：{resetError}</Alert>
      ) : (
        <Button
          size={'large'}
          variant={'contained'}
          sx={{ alignSelf: 'center' }}
          disabled={!passwordValid || requestedChange}
          onClick={async () => {
            setRequestedChange(true);
            try {
              await trpc.resetPassword.mutate({ requestId, newPassword: password });
              setResetSuccess(true);
            } catch (error) {
              setResetSuccess(false);
              setResetError((error as Error).message);
            }
          }}
        >
          提交
        </Button>
      )}
    </>
  );
}

export default PasswordReset;
