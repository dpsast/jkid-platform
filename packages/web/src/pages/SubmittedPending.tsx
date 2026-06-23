import { Link, Typography } from '@mui/material';

function SubmittedPending() {
  return (
    <>
      <Typography>感谢你的注册！请等待我们审核。</Typography>
      <Typography>
        审核通过后，你的学生邮箱将会收到一封邮件。你可以在一段时间后尝试用注册时的用户名和临时密码登录我们的{' '}
        <Link href={'https://git.dpsast.org/'}>Gitea 平台</Link>。
      </Typography>
    </>
  );
}

export default SubmittedPending;
