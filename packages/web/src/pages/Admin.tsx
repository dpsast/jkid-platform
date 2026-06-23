import { Alert, Box, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import trpc from '../shared/trpc';

type PendingUser = {
  studentId: string;
  realName: string;
  username: string;
  email: string;
  department: string;
  reason: string;
};

function Admin() {
  const [adminToken, setAdminToken] = useState('');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operatingStudentId, setOperatingStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await trpc.admin.listPendingUsers.query({ adminToken });
      setPendingUsers(users);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading pending users:', error);
      setError('无法加载待审核用户，请检查 admin token。');
    } finally {
      setLoading(false);
    }
  };

  const reviewUser = async (studentId: string, action: 'approve' | 'reject') => {
    setOperatingStudentId(studentId);
    setError(null);
    try {
      if (action === 'approve') {
        await trpc.admin.approveUser.mutate({ adminToken, studentId });
      } else {
        await trpc.admin.rejectUser.mutate({ adminToken, studentId });
      }
      await loadPendingUsers();
    } catch (error) {
      console.error('Error reviewing user:', error);
      setError(action === 'approve' ? '通过审核失败，请稍后重试。' : '拒绝申请失败，请稍后重试。');
    } finally {
      setOperatingStudentId(null);
    }
  };

  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant={'h5'}>审核注册申请</Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <TextField
          fullWidth
          label={'Admin Token'}
          type={'password'}
          value={adminToken}
          onChange={(event) => setAdminToken(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && adminToken && !loading) {
              void loadPendingUsers();
            }
          }}
        />
        <Button
          variant={'contained'}
          disabled={!adminToken || loading}
          onClick={() => {
            void loadPendingUsers();
          }}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} color={'inherit'} /> : '加载'}
        </Button>
      </Stack>

      {error && <Alert severity={'error'}>{error}</Alert>}

      {hasLoaded && pendingUsers.length === 0 && <Alert severity={'success'}>当前没有待审核用户。</Alert>}

      <Stack spacing={2}>
        {pendingUsers.map((user) => (
          <Box
            key={user.studentId}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: 'background.paper',
            }}
          >
            <Box>
              <Typography variant={'h6'}>{user.realName}</Typography>
              <Typography variant={'body2'} color={'text.secondary'}>
                {user.username} · {user.studentId}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' }, gap: 1 }}>
              <Typography color={'text.secondary'}>邮箱</Typography>
              <Typography>{user.email}</Typography>
              <Typography color={'text.secondary'}>院系</Typography>
              <Typography>{user.department || '未填写'}</Typography>
              <Typography color={'text.secondary'}>注册理由</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{user.reason || '未填写'}</Typography>
            </Box>

            <Stack direction={'row'} spacing={1} sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant={'outlined'}
                color={'error'}
                disabled={operatingStudentId !== null || loading}
                onClick={() => {
                  void reviewUser(user.studentId, 'reject');
                }}
              >
                {operatingStudentId === user.studentId ? '处理中' : '拒绝'}
              </Button>
              <Button
                variant={'contained'}
                disabled={operatingStudentId !== null || loading}
                onClick={() => {
                  void reviewUser(user.studentId, 'approve');
                }}
              >
                {operatingStudentId === user.studentId ? '处理中' : '通过'}
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </>
  );
}

export default Admin;
