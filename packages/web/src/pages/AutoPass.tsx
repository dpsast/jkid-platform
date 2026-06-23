import { Link, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';

function AutoPass() {
  const [searchParams] = useSearchParams();

  const username = searchParams.get('username');
  const tempPassword = searchParams.get('tempPassword');

  return (
    <>
      <Typography>感谢你的注册！你的学号位于我们维护的“自动通过名单”中，因此恭喜你已经拥有了饥渴 ID！</Typography>
      <Typography>
        你的用户名：<b>{username}</b>；你的临时密码：<b>{tempPassword}</b>
      </Typography>
      <Typography>
        请注意这是一个<b>临时</b>密码，在审核通过第一次登录时依然会要求你修改密码。
      </Typography>
      <Typography>
        欢迎用以上凭据登录我们的 <Link href={'https://git.dpsast.org/user/login'}>Gitea 平台</Link>！
      </Typography>
    </>
  );
}

export default AutoPass;
